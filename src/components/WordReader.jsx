import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'
import { STRESS_MARKS } from '../data/curriculum'

export default function WordReader({ 
  word, 
  showStress = true,
  syllables = [],
  onComplete 
}) {
  const [highlightedSyllable, setHighlightedSyllable] = useState(-1)
  const [isReading, setIsReading] = useState(false)
  const [hasRead, setHasRead] = useState(false)

  const wordWithStress = STRESS_MARKS[word] || word
  const wordSyllables = syllables.length > 0 ? syllables : splitIntoSyllables(word)

  function splitIntoSyllables(w) {
    const result = []
    let current = ''
    const vowels = 'АЕЁИОУЫЭЮЯ'
    
    for (let i = 0; i < w.length; i++) {
      current += w[i]
      if (vowels.includes(w[i])) {
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
    
    return result.length > 0 ? result : [w]
  }

  const readWord = async () => {
    setIsReading(true)
    setHighlightedSyllable(-1)
    
    for (let i = 0; i < wordSyllables.length; i++) {
      setHighlightedSyllable(i)
      await speechService.speakSyllable(wordSyllables[i])
      await new Promise(r => setTimeout(r, 300))
    }
    
    setHighlightedSyllable(-1)
    await speechService.speakWord(word)
    
    setIsReading(false)
    setHasRead(true)
  }

  const handleSyllableClick = async (index) => {
    setHighlightedSyllable(index)
    await speechService.speakSyllable(wordSyllables[index])
    setHighlightedSyllable(-1)
  }

  const handleComplete = () => {
    onComplete?.(word)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-2xl font-bold text-gray-700">
        Прочитай слово:
      </div>
      
      <div className="flex items-center gap-2 text-6xl font-bold">
        {wordSyllables.map((syllable, i) => (
          <button
            key={i}
            onClick={() => handleSyllableClick(i)}
            className={`
              px-4 py-2 rounded-xl transition-all duration-200
              ${highlightedSyllable === i 
                ? 'bg-yellow-200 scale-110 shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200'}
              ${showStress && i === 0 ? 'text-red-500' : ''}
            `}
          >
            {syllable}
            {showStress && i === 0 && (
              <span className="text-red-500 text-2xl block text-center">́</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={readWord}
          disabled={isReading}
          className="px-8 py-4 bg-blue-500 text-white rounded-2xl text-xl font-bold
                     hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          🔊 Прочитай мне
        </button>
        
        {hasRead && (
          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-green-500 text-white rounded-2xl text-xl font-bold
                       hover:bg-green-600 transition-colors animate-bounce"
          >
            ✅ Я прочитал!
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4 h-32 w-32">
        {getWordVisual(word).image ? (
          <img
            src={getWordVisual(word).image}
            alt={word}
            className="max-h-full max-w-full object-contain animate-fadeIn"
          />
        ) : (
          <div className="text-8xl">{getWordVisual(word).emoji}</div>
        )}
      </div>
    </div>
  )
}

function getWordVisual(word) {
  const visuals = {
    'МАМА': { emoji: '👩', image: 'https://img.icons8.com/color/200/mother.png' },
    'ПАПА': { emoji: '👨', image: 'https://img.icons8.com/color/200/father.png' },
    'КОТ': { emoji: '🐱', image: 'https://img.icons8.com/color/200/cat.png' },
    'СОМ': { emoji: '🐟', image: 'https://img.icons8.com/color/200/fish.png' },
    'НОС': { emoji: '👃', image: 'https://img.icons8.com/color/200/nose.png' },
    'ДОМ': { emoji: '🏠', image: 'https://img.icons8.com/color/200/home.png' },
    'РАК': { emoji: '🦀', image: 'https://img.icons8.com/color/200/crayfish.png' },
    'ЗУБ': { emoji: '🦷', image: 'https://img.icons8.com/color/200/tooth.png' },
    'ВОЛК': { emoji: '🐺', image: 'https://img.icons8.com/color/200/wolf.png' },
    'МОСТ': { emoji: '🌉', image: 'https://img.icons8.com/color/200/bridge.png' },
    'КУСТ': { emoji: '🌿', image: 'https://img.icons8.com/color/200/shrub.png' },
    'СЛОН': { emoji: '🐘', image: 'https://img.icons8.com/color/200/elephant.png' },
    'ТУТ': { emoji: '👆', image: 'https://img.icons8.com/color/200/point-up.png' },
    'ЛАМА': { emoji: '🦙', image: 'https://img.icons8.com/color/200/llama.png' },
    'ПАУК': { emoji: '🕷️', image: 'https://img.icons8.com/color/200/spider.png' },
    'МАЛИНА': { emoji: '🫐', image: 'https://img.icons8.com/color/200/raspberry.png' }
  }
  return visuals[word] || { emoji: '❓' }
}
