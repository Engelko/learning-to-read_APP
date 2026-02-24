import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'

const CHARACTERS = [
  { id: 'dino', name: 'Динозаврик', emoji: '🦕', color: 'bg-green-400' },
  { id: 'rocket', name: 'Ракета', emoji: '🚀', color: 'bg-blue-400' },
  { id: 'animal', name: 'Левёнок', emoji: '🦁', color: 'bg-orange-400' }
]

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('')
  const [selectedChar, setSelectedChar] = useState('dino')
  const [isReady, setIsReady] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    speechService.init()
    speechService.unlockAudio()
  }, [])

  const handleCharSelect = (charId) => {
    setSelectedChar(charId)
    const char = CHARACTERS.find(c => c.id === charId)
    speechService.speak(char.name)
  }

  const handleStart = async () => {
    if (!name.trim()) {
      await speechService.speak('Напиши своё имя!')
      return
    }
    
    setIsReady(true)
    await speechService.speak(`Привет, ${name}! Начинаем учиться читать!`)
    
    setTimeout(() => {
      onStart(name.trim(), selectedChar)
    }, 2000)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  if (isReady) {
    const char = CHARACTERS.find(c => c.id === selectedChar)
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 
                      flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="text-9xl mb-8 animate-bounce">
            {char.emoji}
          </div>
          <div className="text-4xl text-white font-bold">
            Привет, {name}!
          </div>
          <div className="text-2xl text-white/80 mt-4">
            Начинаем приключение!
          </div>
          <div className="mt-8 text-6xl animate-pulse">
            ⭐ 🌟 ✨
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-200
                    flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
          Учись Читать!
        </h1>
        <p className="text-xl md:text-2xl text-white/90">
          Игра для маленьких читателей
        </p>
      </div>
      
      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-700 mb-2">
            Как тебя зовут?
          </div>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Введи имя..."
            className="w-full px-6 py-4 text-2xl text-center rounded-2xl border-2 
                       border-gray-200 focus:border-green-400 focus:outline-none
                       transition-colors"
            maxLength={20}
          />
        </div>
        
        <div className="mb-8">
          <div className="text-xl font-bold text-gray-700 text-center mb-4">
            Выбери друга:
          </div>
          <div className="flex justify-center gap-4">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => handleCharSelect(char.id)}
                className={`
                  w-24 h-24 rounded-3xl text-5xl
                  transition-all duration-200
                  ${selectedChar === char.id 
                    ? 'scale-110 ring-4 ring-green-400 shadow-lg' 
                    : 'opacity-60 hover:opacity-100 hover:scale-105'}
                  ${char.color}
                `}
                aria-label={char.name}
                aria-pressed={selectedChar === char.id}
              >
                {char.emoji}
              </button>
            ))}
          </div>
          <div className="text-center mt-3 text-lg text-gray-600">
            {CHARACTERS.find(c => c.id === selectedChar)?.name}
          </div>
        </div>
        
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className={`
            w-full py-5 rounded-2xl text-2xl font-bold text-white
            transition-all duration-200
            ${name.trim()
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          🎮 Начать!
        </button>
      </div>
      
      <div className="mt-8 flex gap-4 text-4xl">
        <span className="animate-bounce" style={{ animationDelay: '0s' }}>🦕</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🚀</span>
        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🦁</span>
      </div>
    </div>
  )
}
