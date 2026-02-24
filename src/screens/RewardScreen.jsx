import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'

export default function RewardScreen({ 
  type = 'lesson',
  childName,
  character,
  achievement,
  onClose 
}) {
  const [visible, setVisible] = useState(false)
  const [animPhase, setAnimPhase] = useState(0)

  useEffect(() => {
    setVisible(true)
    
    const playAudio = async () => {
      await speechService.speakEncouragement('reward')
      if (achievement) {
        await speechService.speak(`Ты получил ${achievement}!`)
      }
    }
    
    playAudio()
    
    const timer = setTimeout(() => {
      setAnimPhase(1)
    }, 500)
    
    const timer2 = setTimeout(() => {
      setAnimPhase(2)
    }, 1500)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [achievement])

  const getRewardVisual = () => {
    switch (type) {
      case 'checkpoint':
        return { emoji: '⭐', image: 'https://img.icons8.com/color/200/star.png' }
      case 'stage':
        return { emoji: '🏆', image: 'https://img.icons8.com/color/200/trophy.png' }
      case 'final':
        return { emoji: '👑', image: 'https://img.icons8.com/color/200/crown.png' }
      default:
        return { emoji: '🌟', image: 'https://img.icons8.com/color/200/shining-stars.png' }
    }
  }

  const getMessage = () => {
    switch (type) {
      case 'checkpoint':
        return 'Ты прошёл важный этап!'
      case 'stage':
        return 'Этап завершён!'
      case 'final':
        return 'Ты научился читать!'
      default:
        return 'Отличная работа!'
    }
  }

  const getCharacterVisual = () => {
    switch (character) {
      case 'dino':
        return { emoji: '🦕', image: 'https://img.icons8.com/color/200/stegosaurus.png' }
      case 'rocket':
        return { emoji: '🚀', image: 'https://img.icons8.com/color/200/rocket.png' }
      case 'animal':
        return { emoji: '🦁', image: 'https://img.icons8.com/color/200/lion.png' }
      default:
        return { emoji: '⭐', image: null }
    }
  }

  return (
    <div className={`
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/50 backdrop-blur-sm
      transition-opacity duration-300
      ${visible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4
        text-center
        transition-transform duration-500
        ${visible ? 'scale-100' : 'scale-75'}
      `}>
        <div className="flex justify-center mb-4 h-32">
          {getRewardVisual().image ? (
            <img src={getRewardVisual().image} alt="reward" className="h-full object-contain animate-bounce" />
          ) : (
            <div className="text-8xl animate-bounce">{getRewardVisual().emoji}</div>
          )}
        </div>
        
        <div className={`
          flex justify-center mb-4 h-24
          transition-all duration-500
          ${animPhase >= 1 ? 'animate-bounce' : ''}
        `}>
          {getCharacterVisual().image ? (
            <img src={getCharacterVisual().image} alt="character" className="h-full object-contain" />
          ) : (
            <div className="text-6xl">{getCharacterVisual().emoji}</div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {getMessage()}
        </h2>
        
        <p className="text-xl text-gray-600 mb-6">
          {childName}, ты молодец!
        </p>
        
        {achievement && (
          <div className="bg-yellow-100 rounded-2xl p-4 mb-6">
            <div className="text-lg text-yellow-800">
              🎖️ {achievement}
            </div>
          </div>
        )}
        
        <div className="flex justify-center gap-2 text-3xl mb-6">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-4 bg-green-500 text-white rounded-2xl text-xl font-bold
                     hover:bg-green-600 transition-colors"
        >
          Продолжить →
        </button>
      </div>
    </div>
  )
}
