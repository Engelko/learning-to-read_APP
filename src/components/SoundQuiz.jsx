import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'

export default function SoundQuiz({ 
  letters, 
  onComplete,
  count = 5 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [targetLetter, setTargetLetter] = useState(null)
  const [options, setOptions] = useState([])
  const [result, setResult] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [asked, setAsked] = useState([])

  useEffect(() => {
    generateQuestion()
  }, [])

  const generateQuestion = () => {
    const available = letters.filter(l => !asked.includes(l))
    if (available.length === 0) {
      onComplete?.(correctCount, count)
      return
    }

    const target = available[Math.floor(Math.random() * available.length)]
    const wrongOptions = letters
      .filter(l => l !== target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
    
    const allOptions = shuffleArray([target, ...wrongOptions])
    
    setTargetLetter(target)
    setOptions(allOptions)
    setAsked(prev => [...prev, target])
    
    setTimeout(() => {
      speechService.speakLetter(target)
    }, 500)
  }

  const shuffleArray = (arr) => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
  }

  const handleAnswer = async (letter) => {
    if (letter === targetLetter) {
      setResult('correct')
      setCorrectCount(c => c + 1)
      await speechService.speakEncouragement('success')
      
      setTimeout(() => {
        setResult(null)
        setCurrentIndex(i => i + 1)
        generateQuestion()
      }, 1000)
    } else {
      setResult('wrong')
      await speechService.speakEncouragement('encourage')
      
      setTimeout(() => {
        setResult(null)
        speechService.speakLetter(targetLetter)
      }, 800)
    }
  }

  const playSound = () => {
    if (targetLetter) {
      speechService.speakLetter(targetLetter)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xl text-gray-600">
        Вопрос {currentIndex + 1} из {count}
      </div>
      
      <div className="text-2xl font-bold text-gray-700">
        Найди букву, которую услышал!
      </div>
      
      <button
        onClick={playSound}
        className="w-24 h-24 bg-orange-400 rounded-full text-5xl
                   hover:bg-orange-500 transition-colors shadow-lg
                   flex items-center justify-center"
      >
        🔊
      </button>
      
      <div className="flex gap-6 mt-4">
        {options.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAnswer(letter)}
            disabled={result !== null}
            className={`
              w-28 h-32 rounded-3xl text-6xl font-bold
              transition-all duration-200
              ${result === 'correct' && letter === targetLetter
                ? 'bg-green-400 text-white scale-110' 
                : ''}
              ${result === 'wrong' && letter === targetLetter
                ? 'bg-red-400 text-white' 
                : ''}
              ${!result 
                ? 'bg-white hover:bg-gray-100 hover:scale-105 shadow-lg' 
                : ''}
              ${result && letter !== targetLetter ? 'opacity-50' : ''}
            `}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {result === 'correct' && (
        <div className="text-2xl text-green-500 font-bold animate-bounce">
          ✅ Молодец!
        </div>
      )}
      
      {result === 'wrong' && (
        <div className="text-xl text-orange-500">
          Попробуй ещё! Послушай внимательно 🔊
        </div>
      )}
      
      <div className="flex gap-2 mt-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`
              w-4 h-4 rounded-full
              ${i < correctCount ? 'bg-green-400' : 'bg-gray-300'}
              ${i === currentIndex ? 'ring-2 ring-blue-400' : ''}
            `}
          />
        ))}
      </div>
    </div>
  )
}
