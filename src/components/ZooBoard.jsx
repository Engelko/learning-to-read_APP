import { useState, useEffect, useCallback } from 'react'
import { speechService } from '../services/speech'

export default function ZooBoard({ words, onComplete }) {
  const [currentWord, setCurrentWord] = useState(0)
  const [readWords, setReadWords] = useState([])
  const [showAnimal, setShowAnimal] = useState(false)

  const animals = {
    'МАМА': { emoji: '👩', name: 'мама' },
    'ПАПА': { emoji: '👨', name: 'папа' },
    'КОТ': { emoji: '🐱', name: 'кот' },
    'СОМ': { emoji: '🐟', name: 'сом' },
    'НОС': { emoji: '👃', name: 'нос' },
    'ЛАМА': { emoji: '🦙', name: 'лама' },
    'СЛОН': { emoji: '🐘', name: 'слон' },
    'РАК': { emoji: '🦀', name: 'рак' },
    'ДОМ': { emoji: '🏠', name: 'дом' },
    'ПАУК': { emoji: '🕷️', name: 'паук' }
  }

  const handleWordRead = async (word) => {
    await speechService.speakWord(word)
    setShowAnimal(true)
    
    setTimeout(async () => {
      await speechService.speakEncouragement('success')
      setReadWords(prev => [...prev, word])
      setShowAnimal(false)
      
      if (currentWord < words.length - 1) {
        setCurrentWord(prev => prev + 1)
      } else {
        onComplete?.(readWords)
      }
    }, 1500)
  }

  const handleSpeakWord = (word) => {
    speechService.speakWord(word)
  }

  const word = words[currentWord]
  const animal = animals[word] || { emoji: '❓', name: word.toLowerCase() }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xl text-gray-600">
        Слово {currentWord + 1} из {words.length}
      </div>
      
      <div className="text-2xl font-bold text-gray-700">
        Прочитай табличку!
      </div>
      
      <div className={`
        relative w-64 h-72 bg-gradient-to-b from-amber-100 to-amber-200
        rounded-3xl border-4 border-amber-400 shadow-xl
        flex flex-col items-center justify-center
        transition-all duration-300
        ${showAnimal ? 'scale-105' : ''}
      `}>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-amber-600 rounded-t-lg" />
        
        <div className="text-6xl font-bold text-gray-800 mb-4">
          {word}
        </div>
        
        <div className={`
          text-7xl transition-all duration-500
          ${showAnimal ? 'scale-125 animate-bounce' : 'opacity-50'}
        `}>
          {showAnimal ? animal.emoji : '❓'}
        </div>
        
        {showAnimal && (
          <div className="text-lg text-gray-600 mt-2 animate-fadeIn">
            {animal.name}
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => handleSpeakWord(word)}
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-bold
                     hover:bg-blue-600 transition-colors"
        >
          🔊 Послушать
        </button>
        
        <button
          onClick={() => handleWordRead(word)}
          className="px-8 py-3 bg-green-500 text-white rounded-full text-lg font-bold
                     hover:bg-green-600 transition-colors"
        >
          ✅ Я прочитал!
        </button>
      </div>
      
      <div className="flex gap-2 mt-4">
        {words.map((w, i) => (
          <div
            key={w}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-xl
              transition-all duration-200
              ${readWords.includes(w) 
                ? 'bg-green-400 text-white' 
                : i === currentWord 
                  ? 'bg-blue-400 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-400'}
            `}
          >
            {readWords.includes(w) ? '✅' : animals[w]?.emoji || '?'}
          </div>
        ))}
      </div>
    </div>
  )
}
