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
      
      <div className="flex items-center gap-4 mt-4 text-8xl">
        {getWordEmoji(word)}
      </div>
    </div>
  )
}

function getWordEmoji(word) {
  const emojis = {
    'МАМА': '👩',
    'ПАПА': '👨',
    'КОТ': '🐱',
    'СОМ': '🐟',
    'НОС': '👃',
    'ДОМ': '🏠',
    'РАК': '🦀',
    'ЗУБ': '🦷',
    'ВОЛК': '🐺',
    'МОСТ': '🌉',
    'КУСТ': '🌿',
    'СЛОН': '🐘',
    'ТУТ': '👆',
    'ЛАМА': '🦙',
    'ПАУК': '🕷️',
    'МАЛИНА': '🫐'
  }
  return emojis[word] || '❓'
}
