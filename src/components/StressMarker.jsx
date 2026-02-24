import { useState } from 'react'
import { speechService } from '../services/speech'
import { STRESS_MARKS } from '../data/curriculum'

export default function StressMarker({ words, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState([])
  const [selectedStress, setSelectedStress] = useState(null)
  const [showFeedback, setShowFeedback] = useState(null)

  const currentWord = words[currentIndex]
  const syllables = splitIntoSyllables(currentWord)
  const correctStress = 0

  function splitIntoSyllables(word) {
    const result = []
    let current = ''
    const vowels = 'АЕЁИОУЫЭЮЯ'
    
    for (let i = 0; i < word.length; i++) {
      current += word[i]
      if (vowels.includes(word[i])) {
        result.push(current)
        current = ''
      }
    }
    
    if (current) {
      if (result.length > 0) {
        result[result.length - 1] += current
      } else {
        result.push(current)
      }
    }
    
    return result.length > 0 ? result : [word]
  }

  const handleSyllableClick = async (index) => {
    setSelectedStress(index)
    
    if (index === correctStress) {
      setShowFeedback('correct')
      await speechService.speakWord(currentWord)
      await speechService.speakEncouragement('success')
      
      setResults(prev => [...prev, { word: currentWord, correct: true }])
      
      setTimeout(() => {
        moveNext()
      }, 1500)
    } else {
      setShowFeedback('wrong')
      await speechService.speakEncouragement('encourage')
      
      setTimeout(() => {
        setShowFeedback(null)
        setSelectedStress(null)
      }, 1000)
    }
  }

  const moveNext = () => {
    setShowFeedback(null)
    setSelectedStress(null)
    
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onComplete?.(results)
    }
  }

  const playWord = () => {
    speechService.speakWord(currentWord)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xl text-gray-600">
        Слово {currentIndex + 1} из {words.length}
      </div>
      
      <div className="text-2xl font-bold text-gray-700">
        Нажми на ударный слог! 👆
      </div>
      
      <button
        onClick={playWord}
        className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-bold
                   hover:bg-blue-600 transition-colors"
      >
        🔊 Послушать слово
      </button>
      
      <div className={`
        flex items-center gap-4 p-6 rounded-2xl
        ${showFeedback === 'correct' ? 'bg-green-100' : ''}
        ${showFeedback === 'wrong' ? 'bg-red-100' : 'bg-gray-100'}
        transition-colors duration-300
      `}>
        {syllables.map((syllable, i) => (
          <button
            key={i}
            onClick={() => handleSyllableClick(i)}
            className={`
              relative px-6 py-4 rounded-xl text-4xl font-bold
              transition-all duration-200
              ${selectedStress === i
                ? 'bg-red-400 text-white scale-110'
                : 'bg-white hover:bg-gray-50'}
            `}
          >
            {syllable}
            {selectedStress === i && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">
                ́
              </span>
            )}
          </button>
        ))}
      </div>
      
      {showFeedback === 'correct' && (
        <div className="text-2xl text-green-500 font-bold animate-bounce">
          ✅ Правильно! Ударение на первый слог!
        </div>
      )}
      
      {showFeedback === 'wrong' && (
        <div className="text-xl text-orange-500">
          Попробуй ещё! Послушай слово внимательно 🔊
        </div>
      )}
      
      <div className="flex gap-2 mt-4">
        {words.map((_, i) => (
          <div
            key={i}
            className={`
              w-4 h-4 rounded-full
              ${results[i]?.correct ? 'bg-green-400' : 'bg-gray-300'}
              ${i === currentIndex ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
            `}
          />
        ))}
      </div>
    </div>
  )
}
