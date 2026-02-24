import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'

export default function SentenceReader({ sentences, onComplete }) {
  const [currentSentence, setCurrentSentence] = useState(0)
  const [readSentences, setReadSentences] = useState([])
  const [highlightedWord, setHighlightedWord] = useState(-1)
  const [showImage, setShowImage] = useState(false)

  const sentenceImages = {
    'КОТ СПИТ': '🐱💤',
    'МАМА ДОМА': '👩🏠',
    'ВОТ ДОМ': '👆🏠',
    'РАК ТУТ': '🦀👆',
    'СЛОН ЕСТ': '🐘🍽️',
    'ПАПА ТУТ': '👨👆'
  }

  const current = sentences[currentSentence]
  const words = current?.split(' ') || []
  const image = sentenceImages[current] || '📖'

  const handleWordClick = async (word, index) => {
    setHighlightedWord(index)
    await speechService.speakWord(word)
    setHighlightedWord(-1)
  }

  const handleReadSentence = async () => {
    for (let i = 0; i < words.length; i++) {
      setHighlightedWord(i)
      await speechService.speakWord(words[i])
      await new Promise(r => setTimeout(r, 200))
    }
    setHighlightedWord(-1)
    
    await speechService.speakSentence(current)
    setShowImage(true)
  }

  const handleConfirm = async () => {
    await speechService.speakEncouragement('success')
    setReadSentences(prev => [...prev, current])
    setShowImage(false)
    
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(prev => prev + 1)
    } else {
      onComplete?.(readSentences)
    }
  }

  if (!current) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xl text-gray-600">
        Предложение {currentSentence + 1} из {sentences.length}
      </div>
      
      <div className="text-2xl font-bold text-gray-700">
        Прочитай:
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 min-w-72">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {words.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordClick(word, i)}
              className={`
                px-4 py-2 rounded-xl text-3xl font-bold
                transition-all duration-200
                ${highlightedWord === i 
                  ? 'bg-yellow-200 scale-110 shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200'}
              `}
            >
              {word}
            </button>
          ))}
        </div>
        
        <div className="mt-4 text-center text-gray-500 text-lg">
          {current.toLowerCase()}
        </div>
      </div>
      
      {showImage && (
        <div className="text-6xl animate-bounce">
          {image}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={handleReadSentence}
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-bold
                     hover:bg-blue-600 transition-colors"
        >
          🔊 Прочитай мне
        </button>
        
        <button
          onClick={handleConfirm}
          className="px-8 py-3 bg-green-500 text-white rounded-full text-lg font-bold
                     hover:bg-green-600 transition-colors"
        >
          ✅ Я прочитал!
        </button>
      </div>
      
      <div className="flex gap-2 mt-4">
        {sentences.map((s, i) => (
          <div
            key={s}
            className={`
              w-4 h-4 rounded-full transition-colors
              ${readSentences.includes(s) ? 'bg-green-400' : 'bg-gray-300'}
              ${i === currentSentence ? 'ring-2 ring-blue-400' : ''}
            `}
          />
        ))}
      </div>
    </div>
  )
}
