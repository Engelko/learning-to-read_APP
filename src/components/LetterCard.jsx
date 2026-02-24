import { useState, useEffect, useRef } from 'react'
import { speechService } from '../services/speech'
import { LETTER_ANIMALS } from '../data/curriculum'

export default function LetterCard({ 
  letter, 
  onClick, 
  showAnimal = true,
  size = 'normal',
  disabled = false,
  highlight = false,
  onRepeat
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const cardRef = useRef(null)

  const animal = LETTER_ANIMALS[letter] || { animal: '', emoji: '❓' }

  const handleClick = async () => {
    if (disabled || isPlaying) return
    
    setIsActive(true)
    setIsPlaying(true)
    
    try {
      await speechService.speakLetter(letter)
    } catch (e) {
      console.error('Speech error:', e)
    }
    
    setIsPlaying(false)
    onClick?.(letter)
    
    setTimeout(() => setIsActive(false), 200)
  }

  const handleRepeat = async (e) => {
    e.stopPropagation()
    if (isPlaying) return
    
    setIsPlaying(true)
    try {
      await speechService.speakLetter(letter)
    } catch (e) {
      console.error('Speech error:', e)
    }
    setIsPlaying(false)
    onRepeat?.(letter)
  }

  const sizeClasses = {
    small: 'w-20 h-24 text-3xl',
    normal: 'w-32 h-40 text-5xl',
    large: 'w-40 h-48 text-6xl'
  }

  return (
    <div 
      ref={cardRef}
      className={`
        relative flex flex-col items-center justify-center
        ${sizeClasses[size]}
        rounded-3xl cursor-pointer select-none
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${isActive ? 'scale-95' : ''}
        ${highlight ? 'ring-4 ring-green-400 ring-opacity-75' : ''}
        ${isPlaying ? 'bg-green-100' : 'bg-white'}
        shadow-lg hover:shadow-xl
      `}
      onClick={handleClick}
      role="button"
      aria-label={`Буква ${letter}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="text-7xl font-bold text-gray-800 mb-1">
        {letter}
      </div>
      
      {showAnimal && (
        <div className="text-3xl mt-2" aria-hidden="true">
          {animal.emoji}
        </div>
      )}
      
      {isPlaying && (
        <div className="absolute inset-0 rounded-3xl border-4 border-green-400 animate-pulse" />
      )}
      
      <button
        className={`
          absolute -bottom-3 left-1/2 -translate-x-1/2
          w-12 h-12 rounded-full
          bg-orange-400 text-white text-xl
          flex items-center justify-center
          shadow-md hover:bg-orange-500
          transition-all z-10
          ${isPlaying ? 'opacity-50' : ''}
        `}
        onClick={handleRepeat}
        aria-label="Повторить звук"
        disabled={isPlaying}
      >
        🔊
      </button>
    </div>
  )
}
