import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'

export default function RocketLaunch({ syllables, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLaunching, setIsLaunching] = useState(false)
  const [rocketY, setRocketY] = useState(0)
  const [showFlame, setShowFlame] = useState(false)
  const [completedSyllables, setCompletedSyllables] = useState([])

  const handleSyllableClick = async (syllable, index) => {
    if (index !== currentStep) return
    
    await speechService.speakSyllable(syllable)
    setCompletedSyllables(prev => [...prev, syllable])
    setCurrentStep(prev => prev + 1)
    setShowFlame(true)
    
    setTimeout(() => setShowFlame(false), 300)
    
    if (index === syllables.length - 1) {
      await launchRocket()
    }
  }

  const launchRocket = async () => {
    setIsLaunching(true)
    await speechService.speakEncouragement('reward')
    
    let y = 0
    const animate = () => {
      y += 5
      setRocketY(y)
      if (y < 500) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          onComplete?.(syllables)
        }, 500)
      }
    }
    animate()
  }

  const playSyllable = (syllable) => {
    speechService.speakSyllable(syllable)
  }

  if (isLaunching) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-black overflow-hidden">
        <div 
          className="absolute left-1/2 -translate-x-1/2 text-9xl transition-transform"
          style={{ 
            transform: `translateX(-50%) translateY(-${rocketY}px)`,
            transition: 'transform 0.05s linear'
          }}
        >
          🚀
          <div className="text-6xl text-center -mt-4">
            {showFlame && '🔥'}
          </div>
        </div>
        
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${0.5 + Math.random()}s infinite`
            }}
          >
            ✨
          </div>
        ))}
        
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <div className="text-4xl text-white font-bold animate-pulse">
            🎉 ПОЛЕТЕЛИ! 🎉
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-bold text-gray-700">
        Запусти ракету! Читай слоги по порядку
      </div>
      
      <div className="relative w-64 h-96">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-8xl">
          🚀
          {showFlame && (
            <div className="text-4xl text-center -mt-2 animate-pulse">
              🔥
            </div>
          )}
        </div>
        
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center gap-4">
          {syllables.map((syllable, i) => (
            <div
              key={i}
              className={`
                flex items-center gap-4
                ${i > currentStep ? 'opacity-30' : ''}
              `}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                font-bold text-xl
                ${completedSyllables.includes(syllable) 
                  ? 'bg-green-400 text-white' 
                  : 'bg-gray-200 text-gray-700'}
              `}>
                {completedSyllables.includes(syllable) ? '✓' : i + 1}
              </div>
              
              <button
                onClick={() => handleSyllableClick(syllable, i)}
                disabled={i !== currentStep}
                className={`
                  px-6 py-3 rounded-2xl text-3xl font-bold
                  transition-all duration-200
                  ${i === currentStep
                    ? 'bg-blue-500 text-white hover:bg-blue-600 scale-110 shadow-lg animate-pulse'
                    : 'bg-gray-100 text-gray-400'}
                  ${completedSyllables.includes(syllable)
                    ? 'bg-green-100 text-green-600'
                    : ''}
                `}
              >
                {syllable}
              </button>
              
              {i === currentStep && (
                <button
                  onClick={() => playSyllable(syllable)}
                  className="w-10 h-10 bg-orange-400 rounded-full text-xl
                             hover:bg-orange-500 transition-colors"
                >
                  🔊
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-1 mt-4">
        {syllables.map((_, i) => (
          <div
            key={i}
            className={`
              w-8 h-3 rounded-full transition-colors
              ${i < completedSyllables.length ? 'bg-green-400' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  )
}
