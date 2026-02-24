import { useState, useEffect } from 'react'
import { speechService } from '../services/speech'
import { getDayData } from '../data/curriculum'
import LetterCard from '../components/LetterCard'
import FeedingGame from '../components/FeedingGame'
import SyllableBuilder from '../components/SyllableBuilder'
import WordReader from '../components/WordReader'
import SoundQuiz from '../components/SoundQuiz'
import RocketLaunch from '../components/RocketLaunch'
import StressMarker from '../components/StressMarker'
import DrawPad from '../components/DrawPad'

export default function LessonScreen({ dayNumber, progress, onComplete, onBack }) {
  const [phase, setPhase] = useState('intro')
  const [currentStep, setCurrentStep] = useState(0)
  const [dayData, setDayData] = useState(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    const data = getDayData(dayNumber)
    setDayData(data)
    speechService.init()
  }, [dayNumber])

  useEffect(() => {
    if (phase === 'intro' && dayData) {
      speechService.speak(dayData.title)
    }
  }, [phase, dayData])

  const startLesson = async () => {
    await speechService.speak('Начинаем занятие!')
    setPhase('game')
  }

  const handleGameComplete = (result) => {
    setCorrectAnswers(prev => prev + 1)
    setCurrentStep(prev => {
      const nextStep = prev + 1

      // Determine next phase based on available data
      if (dayData?.words && dayData.words.length > 0) {
        setPhase('reading')
      } else if (dayData?.syllables && dayData.syllables.length > 0 && phase !== 'game') {
        // If we have syllables and we haven't just come from a syllable game
        setPhase('reading')
      } else {
        setPhase('creative')
      }

      return nextStep
    })
  }

  const handleReadingComplete = () => {
    setPhase('creative')
  }

  const handleCreativeComplete = () => {
    setShowReward(true)
    
    setTimeout(() => {
      onComplete({
        correctAnswers,
        knownLetters: dayData?.letters || [],
        completedPhases: ['game', 'reading', 'creative']
      })
    }, 2500)
  }

  const finishLesson = () => {
    onComplete({
      correctAnswers,
      knownLetters: dayData?.letters || [],
      completedPhases: ['game', 'reading', 'creative']
    })
  }

  if (!dayData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Загрузка...</div>
      </div>
    )
  }

  if (showReward) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-400
                      flex flex-col items-center justify-center p-6">
        <div className="text-center animate-fadeIn">
          <div className="text-9xl mb-6 animate-bounce">
            {progress.character === 'dino' ? '🦖' : 
             progress.character === 'rocket' ? '🚀' : '🦁'}
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 Отлично!
          </h1>
          
          <p className="text-2xl text-white/90">
            {progress.childName}, ты молодец!
          </p>
          
          <div className="mt-8 flex justify-center gap-2 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-200 to-blue-200
                      flex flex-col items-center justify-center p-6">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 px-4 py-2 bg-white/50 rounded-full text-lg
                     hover:bg-white/80 transition-colors"
        >
          ← Назад
        </button>
        
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">
            {dayData.isCheckpoint ? '⭐' : '📖'}
          </div>
          
          <div className="text-xl text-gray-600 mb-2">
            Занятие {dayNumber}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {dayData.title}
          </h1>
          
          {dayData.gameTitle && (
            <p className="text-lg text-gray-600 mb-6">
              Игра: {dayData.gameTitle}
            </p>
          )}
          
          {dayData.letters && (
            <div className="flex justify-center gap-2 mb-6">
              {dayData.letters.map(l => (
                <span key={l} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl font-bold shadow">
                  {l}
                </span>
              ))}
            </div>
          )}
          
          <button
            onClick={startLesson}
            className="px-8 py-5 bg-green-500 text-white rounded-2xl text-2xl font-bold
                       hover:bg-green-600 transition-colors shadow-lg"
          >
            ▶️ Начать
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'creative') {
    const letterToDraw = dayData.letters?.[0] || 'А'
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 p-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              Творчество
            </h2>
            <p className="text-lg text-gray-600">
              Нарисуй букву {letterToDraw} пальцем!
            </p>
          </div>
          
          <DrawPad 
            letter={letterToDraw}
            onComplete={handleCreativeComplete}
          />
          
          <button
            onClick={finishLesson}
            className="w-full mt-6 px-6 py-4 bg-green-500 text-white rounded-2xl text-xl font-bold
                       hover:bg-green-600 transition-colors"
          >
            ✅ Завершить занятие
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4 flex justify-center">
      <div className="screen-content max-w-2xl">
        <header className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/50 rounded-full text-lg
                       hover:bg-white/80 transition-colors"
          >
            ← Назад
          </button>
          
          <div className="text-lg font-bold text-gray-700">
            Занятие {dayNumber}
          </div>
          
          <div className="flex gap-1">
            <span className={`w-3 h-3 rounded-full ${phase === 'game' ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <span className={`w-3 h-3 rounded-full ${phase === 'reading' ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className={`w-3 h-3 rounded-full ${phase === 'creative' ? 'bg-purple-500' : 'bg-gray-300'}`} />
          </div>
        </header>
        
        <main className="flex flex-col items-center justify-center min-h-[70vh]">
          {phase === 'game' && renderGamePhase()}
          {phase === 'reading' && renderReadingPhase()}
        </main>
      </div>
    </div>
  )

  function renderGamePhase() {
    if (dayData.letters && dayData.game === 'find') {
      return (
        <FeedingGame
          letters={dayData.letters}
          targetLetter={dayData.letters[0]}
          character={progress.character}
          onComplete={handleGameComplete}
        />
      )
    }
    
    if (dayData.letters && dayData.letters.length > 0) {
      return (
        <SoundQuiz
          letters={dayData.letters}
          count={Math.min(dayData.letters.length, 5)}
          onComplete={handleGameComplete}
        />
      )
    }
    
    if (dayData.syllables && dayData.game === 'rocket') {
      return (
        <RocketLaunch
          syllables={dayData.syllables}
          onComplete={handleGameComplete}
        />
      )
    }
    
    if (dayData.syllables && dayData.syllables.length > 0) {
      return (
        <SyllableBuilder
          syllables={dayData.syllables}
          mode="listen"
          onComplete={handleGameComplete}
        />
      )
    }
    
    if (dayData.words && dayData.game === 'stress') {
      return (
        <StressMarker
          words={dayData.words}
          onComplete={handleGameComplete}
        />
      )
    }
    
    if (dayData.words) {
      return (
        <WordReader
          word={dayData.words[0]}
          onComplete={handleGameComplete}
        />
      )
    }
    
    return (
      <div className="text-center">
        <div className="text-2xl mb-4">Готово!</div>
        <button
          onClick={() => setPhase('reading')}
          className="px-6 py-3 bg-green-500 text-white rounded-2xl text-lg font-bold"
        >
          Далее →
        </button>
      </div>
    )
  }

  function renderReadingPhase() {
    if (dayData.words && dayData.words.length > 0) {
      return (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Прочитай слова:
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {dayData.words.map((word, i) => (
              <WordReader
                key={word}
                word={word}
                onComplete={() => {
                  if (i === dayData.words.length - 1) {
                    handleReadingComplete()
                  }
                }}
              />
            ))}
          </div>
        </div>
      )
    }
    
    if (dayData.syllables) {
      return (
        <SyllableBuilder
          syllables={dayData.syllables}
          mode="build"
          onComplete={handleReadingComplete}
        />
      )
    }
    
    handleReadingComplete()
    return null
  }
}
