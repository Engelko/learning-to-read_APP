import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'learnread_progress'

const defaultProgress = {
  childName: '',
  character: 'dino',
  currentDay: 0,
  completedDays: [],
  knownLetters: [],
  unknownLetters: [],
  stage1Progress: {
    lettersLearned: [],
    syllablesRead: [],
    wordsRead: [],
    consecutiveCorrectSyllables: 0,
    stage1Passed: false
  },
  stage2Progress: {
    lettersLearned: [],
    wordsRead: [],
    stage2Passed: false
  },
  stage3Progress: {
    sentencesRead: [],
    stage3Passed: false
  },
  achievements: [],
  lastActivity: null
}

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...defaultProgress, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
    return defaultProgress
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (e) {
      console.error('Failed to save progress:', e)
    }
  }, [progress])

  const updateProgress = useCallback((updates) => {
    setProgress(prev => ({
      ...prev,
      ...updates,
      lastActivity: new Date().toISOString()
    }))
  }, [])

  const setChildInfo = useCallback((name, character) => {
    updateProgress({ childName: name, character })
  }, [updateProgress])

  const completeDay = useCallback((dayNumber, results = {}) => {
    setProgress(prev => {
      const newCompletedDays = prev.completedDays.includes(dayNumber)
        ? prev.completedDays
        : [...prev.completedDays, dayNumber]
      
      const newKnownLetters = results.knownLetters 
        ? [...new Set([...prev.knownLetters, ...results.knownLetters])]
        : prev.knownLetters
      
      const newUnknownLetters = results.unknownLetters
        ? [...new Set([...prev.unknownLetters, ...results.unknownLetters])]
        : prev.unknownLetters

      return {
        ...prev,
        completedDays: newCompletedDays,
        currentDay: Math.max(prev.currentDay, dayNumber + 1),
        knownLetters: newKnownLetters,
        unknownLetters: newUnknownLetters,
        lastActivity: new Date().toISOString()
      }
    })
  }, [])

  const markLetterKnown = useCallback((letter) => {
    setProgress(prev => ({
      ...prev,
      knownLetters: [...new Set([...prev.knownLetters, letter])],
      unknownLetters: prev.unknownLetters.filter(l => l !== letter)
    }))
  }, [])

  const markLetterUnknown = useCallback((letter) => {
    setProgress(prev => ({
      ...prev,
      unknownLetters: [...new Set([...prev.unknownLetters, letter])],
      knownLetters: prev.knownLetters.filter(l => l !== letter)
    }))
  }, [])

  const addSyllableRead = useCallback((syllable) => {
    setProgress(prev => ({
      ...prev,
      stage1Progress: {
        ...prev.stage1Progress,
        syllablesRead: [...new Set([...prev.stage1Progress.syllablesRead, syllable])]
      }
    }))
  }, [])

  const addWordRead = useCallback((word, stage = 1) => {
    setProgress(prev => {
      if (stage === 1) {
        return {
          ...prev,
          stage1Progress: {
            ...prev.stage1Progress,
            wordsRead: [...new Set([...prev.stage1Progress.wordsRead, word])]
          }
        }
      } else if (stage === 2) {
        return {
          ...prev,
          stage2Progress: {
            ...prev.stage2Progress,
            wordsRead: [...new Set([...prev.stage2Progress.wordsRead, word])]
          }
        }
      }
      return prev
    })
  }, [])

  const incrementConsecutiveCorrect = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      stage1Progress: {
        ...prev.stage1Progress,
        consecutiveCorrectSyllables: prev.stage1Progress.consecutiveCorrectSyllables + 1
      }
    }))
  }, [])

  const resetConsecutiveCorrect = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      stage1Progress: {
        ...prev.stage1Progress,
        consecutiveCorrectSyllables: 0
      }
    }))
  }, [])

  const checkStage1Complete = useCallback(() => {
    const requiredLetters = ['А', 'М', 'О', 'У', 'С', 'П', 'К', 'Т', 'Л', 'Н']
    const hasAllLetters = requiredLetters.every(l => 
      progress.knownLetters.includes(l)
    )
    const hasConsecutiveSyllables = progress.stage1Progress.consecutiveCorrectSyllables >= 10
    const hasReadWords = progress.stage1Progress.wordsRead.length >= 1

    if (hasAllLetters && hasConsecutiveSyllables && hasReadWords) {
      setProgress(prev => ({
        ...prev,
        stage1Progress: {
          ...prev.stage1Progress,
          stage1Passed: true
        }
      }))
      return true
    }
    return false
  }, [progress])

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getProgressPercent = useCallback(() => {
    const totalDays = 30
    const completed = progress.completedDays.length
    return Math.round((completed / totalDays) * 100)
  }, [progress.completedDays])

  return {
    progress,
    setChildInfo,
    completeDay,
    markLetterKnown,
    markLetterUnknown,
    addSyllableRead,
    addWordRead,
    incrementConsecutiveCorrect,
    resetConsecutiveCorrect,
    checkStage1Complete,
    resetProgress,
    getProgressPercent
  }
}
