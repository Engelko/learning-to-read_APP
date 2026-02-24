import { useState, useEffect, useCallback } from 'react'
import { speechService } from '../services/speech'

const LEGO_COLORS = {
  'В': '#3B82F6',
  'З': '#10B981',
  'Д': '#F59E0B',
  'Б': '#EF4444',
  'Г': '#8B5CF6',
  'Р': '#EC4899',
  'М': '#6366F1',
  'С': '#14B8A6',
  'П': '#F97316',
  'К': '#84CC16',
  'Т': '#06B6D4',
  'Л': '#A855F7',
  'Н': '#F43F5E'
}

export default function LegoBuilder({ syllables, words, newLetter, onComplete }) {
  const [availableBlocks, setAvailableBlocks] = useState([])
  const [buildArea, setBuildArea] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [completedWords, setCompletedWords] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)

  const currentWord = words?.[currentWordIndex]

  useEffect(() => {
    if (currentWord) {
      const letters = currentWord.split('').map((l, i) => ({
        letter: l,
        id: `${currentWord}-${i}`,
        color: LEGO_COLORS[l] || '#6B7280'
      }))
      setAvailableBlocks(shuffleArray(letters))
      setBuildArea([])
    } else if (syllables) {
      const blocks = syllables.map((s, i) => ({
        letter: s,
        id: `syllable-${i}`,
        color: LEGO_COLORS[s[0]] || '#6B7280',
        isSyllable: true
      }))
      setAvailableBlocks(shuffleArray(blocks))
    }
  }, [currentWord, syllables])

  const shuffleArray = (arr) => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
  }

  const handleBlockClick = useCallback((block) => {
    const letter = block.isSyllable ? block.letter : block.letter
    
    if (block.isSyllable) {
      speechService.speakSyllable(letter)
    } else {
      speechService.speakLetter(letter)
    }
    
    setBuildArea(prev => [...prev, block])
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id))
  }, [])

  const handleRemoveBlock = useCallback((index) => {
    const block = buildArea[index]
    setAvailableBlocks(prev => [...prev, block])
    setBuildArea(prev => prev.filter((_, i) => i !== index))
  }, [buildArea])

  const checkWord = async () => {
    const built = buildArea.map(b => b.letter).join('')
    
    if (built === currentWord) {
      setShowSuccess(true)
      await speechService.speakWord(built)
      await speechService.speakEncouragement('success')
      
      setTimeout(() => {
        setCompletedWords(prev => [...prev, currentWord])
        setShowSuccess(false)
        
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1)
        } else {
          onComplete?.(completedWords)
        }
      }, 1500)
    } else {
      await speechService.speakEncouragement('encourage')
    }
  }

  const resetBuild = () => {
    if (currentWord) {
      const letters = currentWord.split('').map((l, i) => ({
        letter: l,
        id: `${currentWord}-${i}`,
        color: LEGO_COLORS[l] || '#6B7280'
      }))
      setAvailableBlocks(shuffleArray(letters))
      setBuildArea([])
    }
  }

  if (!currentWord && !syllables) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-2xl font-bold text-gray-700">
        {newLetter && `Новая буква: ${newLetter}`}
      </div>
      
      {currentWord && (
        <div className="text-xl text-gray-600">
          Собери слово: <span className="font-bold text-2xl">{currentWord.split('').join(' · ')}</span>
        </div>
      )}
      
      <div className={`
        min-h-20 min-w-72 p-4 rounded-2xl
        flex items-center justify-center gap-1 flex-wrap
        border-4 border-dashed
        transition-all duration-300
        ${showSuccess ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white'}
      `}>
        {buildArea.length === 0 ? (
          <span className="text-gray-400 text-lg">Нажми на блоки по порядку</span>
        ) : (
          buildArea.map((block, i) => (
            <button
              key={`build-${block.id}`}
              onClick={() => handleRemoveBlock(i)}
              className="w-14 h-14 rounded-lg text-2xl font-bold text-white
                         shadow-md hover:shadow-lg hover:scale-105
                         transition-all duration-200 flex items-center justify-center"
              style={{ backgroundColor: block.color }}
            >
              {block.letter}
            </button>
          ))
        )}
      </div>
      
      {showSuccess && (
        <div className="text-2xl text-green-500 font-bold animate-bounce">
          🎉 {currentWord}! Молодец!
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 justify-center">
        {availableBlocks.map((block) => (
          <button
            key={block.id}
            onClick={() => handleBlockClick(block)}
            className={`
              w-16 h-16 rounded-lg text-2xl font-bold text-white
              shadow-lg hover:shadow-xl hover:scale-110
              transition-all duration-200
              flex items-center justify-center
            `}
            style={{ backgroundColor: block.color }}
          >
            {block.letter}
          </button>
        ))}
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={resetBuild}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold
                     hover:bg-gray-300 transition-colors"
        >
          🔄 Сначала
        </button>
        
        {currentWord && buildArea.length > 0 && (
          <button
            onClick={checkWord}
            className="px-8 py-3 bg-green-500 text-white rounded-full font-bold
                       hover:bg-green-600 transition-colors"
          >
            ✅ Проверить
          </button>
        )}
        
        {syllables && availableBlocks.length === 0 && (
          <button
            onClick={() => onComplete?.()}
            className="px-8 py-3 bg-green-500 text-white rounded-full font-bold
                       hover:bg-green-600 transition-colors"
          >
            ✅ Дальше
          </button>
        )}
      </div>
      
      {completedWords.length > 0 && (
        <div className="flex gap-2 mt-4">
          {completedWords.map((w) => (
            <div
              key={w}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold"
            >
              {w} ✓
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
