import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'
import LetterCard from '../components/LetterCard'
import { CURRICULUM } from '../data/curriculum'

export default function DiagnosticScreen({ progress, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState({})
  const [phase, setPhase] = useState('intro')
  const [currentLetter, setCurrentLetter] = useState(null)

  const letters = CURRICULUM.diagnostic.letters

  useEffect(() => {
    speechService.init()
  }, [])

  const startDiagnostic = async () => {
    await speechService.speak('Давай проверим, какие буквы ты уже знаешь!')
    setPhase('testing')
    setCurrentLetter(letters[0])
    setTimeout(() => {
      speechService.speakLetter(letters[0])
    }, 500)
  }

  const handleCardClick = (letter) => {
    speechService.speakLetter(letter)
  }

  const handleResult = async (letter, isKnown) => {
    setResults(prev => ({ ...prev, [letter]: isKnown }))
    
    if (isKnown) {
      await speechService.speakEncouragement('success')
    } else {
      await speechService.speak('Ничего, мы этому научимся!')
    }
    
    setTimeout(() => {
      if (currentIndex < letters.length - 1) {
        setCurrentIndex(prev => prev + 1)
        const nextLetter = letters[currentIndex + 1]
        setCurrentLetter(nextLetter)
        setTimeout(() => {
          speechService.speakLetter(nextLetter)
        }, 300)
      } else {
        setPhase('complete')
      }
    }, 800)
  }

  const finishDiagnostic = async () => {
    const knownLetters = Object.entries(results)
      .filter(([, known]) => known)
      .map(([letter]) => letter)
    
    const unknownLetters = Object.entries(results)
      .filter(([, known]) => !known)
      .map(([letter]) => letter)
    
    await speechService.speak('Отлично! Давай начнём учиться!')
    
    onComplete({
      knownLetters,
      unknownLetters
    })
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-200 to-yellow-100
                      flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 animate-bounce">
            🔍
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Проверка букв
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Давай узнаем, какие буквы ты уже знаешь!
            Нажми на карточку, послушай звук и скажи — знаешь ли ты эту букву?
          </p>
          
          <button
            onClick={startDiagnostic}
            className="px-8 py-5 bg-orange-400 text-white rounded-2xl text-2xl font-bold
                       hover:bg-orange-500 transition-colors shadow-lg"
          >
            🎮 Начать проверку
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    const knownCount = Object.values(results).filter(Boolean).length
    const unknownCount = Object.values(results).filter(Boolean => !Boolean).length

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-200 to-blue-100
                      flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 animate-bounce">
            🎉
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Проверка завершена!
          </h1>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-5xl mb-2">✅</div>
                <div className="text-3xl font-bold text-green-500">{knownCount}</div>
                <div className="text-gray-600">знаешь</div>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-2">📚</div>
                <div className="text-3xl font-bold text-blue-500">{unknownCount}</div>
                <div className="text-gray-600">будем учить</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={finishDiagnostic}
            className="px-8 py-5 bg-green-500 text-white rounded-2xl text-2xl font-bold
                       hover:bg-green-600 transition-colors shadow-lg"
          >
            🚀 Начать учиться!
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100
                    flex flex-col items-center justify-center p-6">
      <div className="screen-content max-w-2xl items-center">
      <div className="text-center mb-6">
        <div className="text-xl text-gray-600 mb-2">
          Буква {currentIndex + 1} из {letters.length}
        </div>
        
        <div className="flex justify-center gap-1 mb-4">
          {letters.map((letter, i) => (
            <div
              key={letter}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${results[letter] === true ? 'bg-green-400 text-white' : ''}
                ${results[letter] === false ? 'bg-orange-400 text-white' : ''}
                ${results[letter] === undefined && i === currentIndex ? 'bg-blue-400 text-white animate-pulse' : ''}
                ${results[letter] === undefined && i !== currentIndex ? 'bg-gray-200 text-gray-500' : ''}
              `}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-700 mb-4">
        Ты знаешь эту букву?
      </div>
      
      <div className="mb-8">
        <LetterCard
          letter={currentLetter}
          onClick={handleCardClick}
          size="large"
        />
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => handleResult(currentLetter, false)}
          className="px-10 py-5 bg-orange-400 text-white rounded-2xl text-2xl font-bold
                     hover:bg-orange-500 transition-colors shadow-lg
                     flex items-center gap-2"
        >
          ❌ Не знаю
        </button>
        
        <button
          onClick={() => handleResult(currentLetter, true)}
          className="px-10 py-5 bg-green-500 text-white rounded-2xl text-2xl font-bold
                     hover:bg-green-600 transition-colors shadow-lg
                     flex items-center gap-2"
        >
          ✅ Знаю!
        </button>
      </div>
      
      <button
        onClick={() => speechService.speakLetter(currentLetter)}
        className="mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-full text-lg font-bold
                   hover:bg-gray-300 transition-colors"
      >
        🔊 Послушать ещё раз
      </button>
      </div>
    </div>
  )
}
