import { useState, useEffect, useCallback } from 'react'
import { speechService } from '../services/speech'

export default function SyllableBuilder({ 
  syllables, 
  words = [],
  onComplete,
  mode = 'build'
}) {
  const [available, setAvailable] = useState([])
  const [selected, setSelected] = useState([])
  const [currentWord, setCurrentWord] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [completedWords, setCompletedWords] = useState([])

  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[0])
      splitIntoLetters(words[0])
    } else if (syllables) {
      setAvailable(syllables.map(s => ({ text: s, id: Math.random() })))
    }
  }, [syllables, words])

  const splitIntoLetters = (word) => {
    const letters = word.split('').map((l, i) => ({ 
      text: l, 
      id: i,
      isVowel: 'АЕЁИОУЫЭЮЯ'.includes(l)
    }))
    setAvailable(shuffleArray(letters))
    setSelected([])
  }

  const shuffleArray = (arr) => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
  }

  const handleSelect = useCallback((item) => {
    setSelected(prev => [...prev, item])
    speechService.speakLetter(item.text)
  }, [])

  const handleRemove = useCallback((index) => {
    const removed = selected[index]
    setSelected(prev => prev.filter((_, i) => i !== index))
    setAvailable(prev => [...prev, removed])
  }, [selected])

  const checkWord = async () => {
    const built = selected.map(s => s.text).join('')
    
    if (currentWord && built === currentWord) {
      setIsCorrect(true)
      await speechService.speakWord(built)
      await speechService.speakEncouragement('success')
      
      setTimeout(() => {
        setCompletedWords(prev => [...prev, currentWord])
        
        const remainingWords = words.filter(w => !completedWords.includes(w) && w !== currentWord)
        if (remainingWords.length > 0) {
          setCurrentWord(remainingWords[0])
          splitIntoLetters(remainingWords[0])
          setIsCorrect(null)
        } else {
          onComplete?.(built)
        }
      }, 1500)
    } else {
      setIsCorrect(false)
      await speechService.speakEncouragement('encourage')
      
      setTimeout(() => {
        setIsCorrect(null)
      }, 1000)
    }
  }

  const playSyllable = async (syllable) => {
    await speechService.speakSyllable(syllable)
  }

  if (mode === 'listen' && syllables) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-2xl font-bold text-gray-700">
          Послушай слоги и повтори!
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {syllables.map((syllable, i) => (
            <button
              key={i}
              onClick={() => playSyllable(syllable)}
              className="w-28 h-24 bg-gradient-to-br from-blue-100 to-blue-200 
                         rounded-2xl text-4xl font-bold text-blue-800
                         shadow-lg hover:shadow-xl hover:scale-105
                         transition-all duration-200"
            >
              {syllable}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onComplete?.()}
          className="mt-6 px-8 py-4 bg-green-500 text-white rounded-2xl 
                     text-xl font-bold hover:bg-green-600 transition-colors"
        >
          ✅ Дальше
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {currentWord && (
        <div className="text-xl text-gray-600">
          Собери слово: <span className="font-bold text-2xl">{currentWord.split('').join(' ')}</span>
        </div>
      )}
      
      <div className={`
        min-h-24 min-w-64 p-4 rounded-2xl border-4 border-dashed
        flex items-center justify-center gap-2 flex-wrap
        ${isCorrect === true ? 'border-green-400 bg-green-50' : ''}
        ${isCorrect === false ? 'border-red-400 bg-red-50 animate-shake' : 'border-gray-300'}
        transition-colors duration-300
      `}>
        {selected.length === 0 ? (
          <span className="text-gray-400 text-xl">Нажми на буквы по порядку</span>
        ) : (
          selected.map((item, i) => (
            <span
              key={`sel-${item.id}`}
              onClick={() => handleRemove(i)}
              className={`
                text-5xl font-bold cursor-pointer hover:scale-110 transition-transform
                ${item.isVowel ? 'text-red-500' : 'text-blue-600'}
              `}
            >
              {item.text}
            </span>
          ))
        )}
      </div>
      
      {isCorrect && (
        <div className="text-2xl text-green-500 font-bold animate-bounce">
          🎉 Правильно!
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {available.map((item) => (
          <button
            key={`avail-${item.id}`}
            onClick={() => handleSelect(item)}
            disabled={selected.find(s => s.id === item.id)}
            className={`
              w-20 h-20 rounded-2xl text-4xl font-bold
              shadow-lg hover:shadow-xl hover:scale-110
              transition-all duration-200
              ${item.isVowel 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
              ${selected.find(s => s.id === item.id) ? 'opacity-30 cursor-not-allowed' : ''}
            `}
          >
            {item.text}
          </button>
        ))}
      </div>
      
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => splitIntoLetters(currentWord)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold
                     hover:bg-gray-300 transition-colors"
        >
          🔄 Сначала
        </button>
        
        {selected.length > 0 && (
          <button
            onClick={checkWord}
            className="px-8 py-3 bg-green-500 text-white rounded-full font-bold
                       hover:bg-green-600 transition-colors"
          >
            ✅ Проверить
          </button>
        )}
      </div>
      
      {completedWords.length > 0 && (
        <div className="mt-4 text-lg text-gray-600">
          Прочитанные слова: {completedWords.join(', ')}
        </div>
      )}
    </div>
  )
}
