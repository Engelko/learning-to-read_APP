import { useState, useEffect, useCallback } from 'react'
import { speechService } from './services/speech'
import { useProgress } from './hooks/useProgress'
import StartScreen from './screens/StartScreen'
import MapScreen from './screens/MapScreen'
import DiagnosticScreen from './screens/DiagnosticScreen'
import LessonScreen from './screens/LessonScreen'
import RewardScreen from './screens/RewardScreen'
import { getDayData, getCheckpoints } from './data/curriculum'

const SCREENS = {
  START: 'start',
  MAP: 'map',
  DIAGNOSTIC: 'diagnostic',
  LESSON: 'lesson',
  REWARD: 'reward'
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.START)
  const [selectedDay, setSelectedDay] = useState(null)
  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState(null)
  
  const {
    progress,
    setChildInfo,
    completeDay,
    markLetterKnown,
    markLetterUnknown
  } = useProgress()

  useEffect(() => {
    const initAudio = async () => {
      await speechService.init()
    }
    initAudio()
    
    const handleUserGesture = () => {
      speechService.unlockAudio()
      document.removeEventListener('click', handleUserGesture)
      document.removeEventListener('touchstart', handleUserGesture)
    }
    
    document.addEventListener('click', handleUserGesture)
    document.addEventListener('touchstart', handleUserGesture)
    
    return () => {
      document.removeEventListener('click', handleUserGesture)
      document.removeEventListener('touchstart', handleUserGesture)
    }
  }, [])

  useEffect(() => {
    if (progress.childName && progress.completedDays.length === 0 && !progress.lastActivity) {
      if (!progress.completedDays.includes(0)) {
        setCurrentScreen(SCREENS.DIAGNOSTIC)
      } else {
        setCurrentScreen(SCREENS.MAP)
      }
    } else if (progress.childName) {
      setCurrentScreen(SCREENS.MAP)
    }
  }, [progress.childName, progress.completedDays, progress.lastActivity])

  const handleStart = useCallback((name, character) => {
    setChildInfo(name, character)
  }, [setChildInfo])

  const handleDiagnosticComplete = useCallback((results) => {
    results.knownLetters?.forEach(l => markLetterKnown(l))
    results.unknownLetters?.forEach(l => markLetterUnknown(l))
    completeDay(0, results)
    setCurrentScreen(SCREENS.MAP)
  }, [markLetterKnown, markLetterUnknown, completeDay])

  const handleSelectDay = useCallback((day) => {
    setSelectedDay(day)
    setCurrentScreen(SCREENS.LESSON)
  }, [])

  const handleLessonComplete = useCallback((results) => {
    completeDay(selectedDay, results)
    setSelectedDay(null)
    
    const dayData = getDayData(selectedDay)
    const checkpoints = getCheckpoints()
    
    if (dayData?.isCheckpoint || dayData?.isStageComplete) {
      setRewardData({
        type: dayData.isFinal ? 'final' : dayData.isStageComplete ? 'stage' : 'checkpoint',
        achievement: dayData.isFinal ? 'Читатель' : dayData.isStageComplete ? 'Этап пройден!' : null
      })
      setShowReward(true)
    } else {
      setCurrentScreen(SCREENS.MAP)
    }
  }, [selectedDay, completeDay])

  const handleBack = useCallback(() => {
    setSelectedDay(null)
    setCurrentScreen(SCREENS.MAP)
  }, [])

  const handleRewardClose = useCallback(() => {
    setShowReward(false)
    setRewardData(null)
    setCurrentScreen(SCREENS.MAP)
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
      localStorage.removeItem('learnread_progress')
      window.location.reload()
    }
  }, [])

  if (currentScreen === SCREENS.START) {
    return <StartScreen onStart={handleStart} />
  }

  if (currentScreen === SCREENS.DIAGNOSTIC) {
    return (
      <DiagnosticScreen 
        progress={progress}
        onComplete={handleDiagnosticComplete}
      />
    )
  }

  if (currentScreen === SCREENS.LESSON && selectedDay !== null) {
    return (
      <LessonScreen
        dayNumber={selectedDay}
        progress={progress}
        onComplete={handleLessonComplete}
        onBack={handleBack}
      />
    )
  }

  return (
    <>
      <MapScreen
        progress={progress}
        onSelectDay={handleSelectDay}
        onContinue={handleSelectDay}
      />
      
      <button
        onClick={handleReset}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm
                   hover:bg-gray-300 transition-colors opacity-50 hover:opacity-100"
      >
        Сбросить прогресс
      </button>
      
      {showReward && (
        <RewardScreen
          type={rewardData?.type}
          childName={progress.childName}
          character={progress.character}
          achievement={rewardData?.achievement}
          onClose={handleRewardClose}
        />
      )}
    </>
  )
}
