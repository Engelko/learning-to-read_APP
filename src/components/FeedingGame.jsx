import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'
import LetterCard from './LetterCard'

export default function FeedingGame({ 
  letters, 
  targetLetter, 
  onComplete,
  character = 'dino'
}) {
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongChoice, setWrongChoice] = useState(null)
  const [fed, setFed] = useState(false)
  const [currentTarget, setCurrentTarget] = useState(targetLetter || letters[0])

  const characters = {
    dino: { emoji: '🦕', happy: '🦖', sound: 'ррр!' },
    rocket: { emoji: '🚀', happy: '🚀', sound: 'вжух!' },
    animal: { emoji: '🦁', happy: '🐯', sound: 'ррр!' }
  }

  const char = characters[character] || characters.dino

  useEffect(() => {
    if (targetLetter) {
      speechService.speakLetter(targetLetter)
    }
  }, [targetLetter])

  const handleLetterClick = async (letter) => {
    if (letter === currentTarget) {
      setFed(true)
      setCorrectCount(c => c + 1)
      
      await speechService.speakEncouragement('success')
      
      setTimeout(() => {
        setFed(false)
        onComplete?.(letter, true)
      }, 1000)
    } else {
      setWrongChoice(letter)
      await speechService.speakEncouragement('encourage')
      
      setTimeout(() => {
        setWrongChoice(null)
      }, 500)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-2xl font-bold text-gray-700">
        Накорми динозаврика буквой {currentTarget}!
      </div>
      
      <div className={`
        text-9xl transition-all duration-300
        ${fed ? 'animate-bounce scale-125' : ''}
      `}>
        {fed ? char.happy : char.emoji}
      </div>
      
      {fed && (
        <div className="text-3xl text-green-500 font-bold animate-pulse">
          Ням-ням! {char.sound}
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {letters.map((letter) => (
          <div
            key={letter}
            className={`
              transition-transform duration-200
              ${wrongChoice === letter ? 'animate-shake' : ''}
            `}
          >
            <LetterCard
              letter={letter}
              onClick={() => handleLetterClick(letter)}
              showAnimal={false}
              size="normal"
            />
          </div>
        ))}
      </div>
      
      <button
        onClick={() => speechService.speakLetter(currentTarget)}
        className="mt-4 px-6 py-3 bg-orange-400 text-white rounded-full text-lg font-bold
                   hover:bg-orange-500 transition-colors shadow-md"
      >
        🔊 Послушать ещё раз
      </button>
    </div>
  )
}
