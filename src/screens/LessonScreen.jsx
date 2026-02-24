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
import LegoBuilder from '../components/LegoBuilder'
import SentenceReader from '../components/SentenceReader'
import ZooBoard from '../components/ZooBoard'

const GAME_INSTRUCTIONS = {
  roar: 'Послушай звук и найди правильную букву',
  voice: 'Послушай звук и найди правильную букву',
  catch: 'Послушай звук и найди правильную букву',
  find: 'Найди и покорми динозаврика нужными буквами',
  train: 'Послушай звук и найди правильную букву',
  body: 'Послушай звук и найди правильную букву',
  speed: 'Послушай звук и найди правильную букву',
  exam: 'Давай проверим все буквы, которые мы выучили!',
  rocket: 'Читай слоги и запускай ракету в космос',
  satellite: 'Поймай сигналы со спутника — читай слоги',
  decode: 'Дешифруй послание — собери слово из слогов',
  planets: 'Прыгай по планетам и собирай слова',
  spacecat: 'Помоги космическому коту собрать слово',
  signal: 'Найди сигнал и собери слово',
  lama: 'Прочитай слово, чтобы помочь ламе',
  catfish: 'Прочитай слово и узнай, что делает сом',
  stress: 'Послушай слово и поставь правильное ударение',
  catball: 'Прочитай слово и помоги котику',
  raspberry: 'Прочитай слово и угости медведя малиной',
  spider: 'Прочитай слово про паучка',
  zoo: 'Мы в зоопарке! Прочитай слова на табличках',
  lego: 'Собери слово из блоков лего',
  builder: 'Собери слово в нашей мастерской',
  sentences: 'Давай почитаем предложения'
}

/**
 * ПОЛНЫЙ ПЛАН ЗАНЯТИЙ:
 * | День  | game-тип  | Компонент      | Пропсы                            | Фаза reading |
 * |-------|-----------|----------------|-----------------------------------|--------------|
 * | 1-3   | roar...   | SoundQuiz      | letters                           | letters      |
 * | 4     | find      | FeedingGame    | letters                           | letters      |
 * | 5-7   | train...  | SoundQuiz      | letters                           | letters      |
 * | 8-9   | rocket... | RocketLaunch   | syllables                         | syllables    |
 * | 10    | decode    | SyllableBuilder| syllables, words                  | words        |
 * | 11-13 | planets.. | SyllableBuilder| syllables, words                  | words        |
 * | 14    | exam      | SoundQuiz      | letters: [stage1_all]             | words        |
 * | 15-16 | lama...   | WordReader     | words[0]                          | words        |
 * | 17    | stress    | StressMarker   | words                             | skip         |
 * | 18    | catball   | WordReader     | words[0]                          | words        |
 * | 19-20 | raspberr..| WordReader     | words[0]                          | words        |
 * | 21    | zoo       | ZooBoard       | words                             | skip         |
 * | 22-27 | lego      | LegoBuilder    | syllables, words, newLetter       | skip         |
 * | 28    | builder   | LegoBuilder    | words                             | skip         |
 * | 29-30 | sentences | SentenceReader | sentences                         | skip         |
 */

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

    if (phase === 'creative' && dayData) {
      const letterToDraw = dayData.newLetter ||
                           (dayData.letters?.[0]) ||
                           (dayData.syllables?.[0]?.[0]) ||
                           (dayData.words?.[0]?.[0]) ||
                           'А'
      speechService.speak(`Нарисуй букву ${letterToDraw} пальцем!`)
    }
  }, [phase, dayData])

  const startLesson = async () => {
    try {
      const instruction = GAME_INSTRUCTIONS[dayData?.game] || 'Начинаем занятие!'
      await speechService.speak(instruction)
    } catch (e) {
      console.error('Speech error:', e)
    }
    setPhase('game')
  }

  const handleGameComplete = async (result) => {
    setCorrectAnswers(prev => prev + 1)

    // Determine next phase based on available data and game type
    const gameType = dayData?.game
    const hasWords = dayData?.words && dayData.words.length > 0
    const hasSyllables = dayData?.syllables && dayData.syllables.length > 0
    const hasSentences = dayData?.sentences && dayData.sentences.length > 0

    // Games that already include full reading activity
    const readingHeavyGames = ['stress', 'zoo', 'lego', 'builder', 'sentences']
    const isReadingHeavy = readingHeavyGames.includes(gameType)

    if (!isReadingHeavy && (hasWords || hasSyllables || hasSentences)) {
      try {
        await speechService.speak('Отлично! А теперь давай почитаем.')
      } catch (e) {}
      setPhase('reading')
    } else {
      try {
        await speechService.speak('Здорово! Теперь давай порисуем.')
      } catch (e) {}
      setPhase('creative')
    }

    setCurrentStep(prev => prev + 1)
  }

  const handleReadingComplete = async () => {
    try {
      await speechService.speak('Замечательно! Теперь давай немного порисуем.')
    } catch (e) {}
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
    const letterToDraw = dayData.newLetter ||
                         (dayData.letters?.[0]) ||
                         (dayData.syllables?.[0]?.[0]) ||
                         (dayData.words?.[0]?.[0]) ||
                         'А'
    
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
    const gameType = dayData.game;

    // Day 1-3, 5-7, 14 (SoundQuiz)
    if (['roar', 'voice', 'catch', 'train', 'body', 'speed'].includes(gameType)) {
      return (
        <SoundQuiz
          letters={dayData.letters || []}
          count={dayData.letters?.length > 3 ? 5 : 3}
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 14: Exam
    if (gameType === 'exam') {
      const stage1Letters = ['А', 'О', 'У', 'И', 'Ы', 'Э', 'М', 'С', 'П', 'К', 'Т', 'Л', 'Н']
      return (
        <SoundQuiz
          letters={stage1Letters}
          count={7}
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 4: Feeding Game
    if (gameType === 'find') {
      return (
        <FeedingGame
          letters={dayData.letters}
          targetLetter={dayData.letters[0]}
          character={progress.character}
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 8-9: Rocket Launch
    if (gameType === 'rocket' || gameType === 'satellite') {
      return (
        <RocketLaunch
          syllables={dayData.syllables || []}
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 10-13, 18 (some items use SyllableBuilder)
    if (['decode', 'planets', 'spacecat', 'signal'].includes(gameType)) {
      return (
        <SyllableBuilder
          syllables={dayData.syllables || []}
          words={dayData.words || []}
          mode="build"
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 15, 16, 18, 19, 20: WordReader
    if (['lama', 'catfish', 'catball', 'raspberry', 'spider'].includes(gameType)) {
       return (
         <WordReader
           word={dayData.words?.[0]}
           onComplete={handleGameComplete}
         />
       )
    }

    // Day 17: Stress Marker
    if (gameType === 'stress') {
      if (!dayData.words || dayData.words.length === 0) {
        setTimeout(handleGameComplete, 0)
        return null
      }
      return (
        <StressMarker
          words={dayData.words || []}
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 21: ZooBoard
    if (gameType === 'zoo') {
      if (!dayData.words || dayData.words.length === 0) {
        setTimeout(handleGameComplete, 0)
        return null
      }
      return (
        <ZooBoard
          words={dayData.words}
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 22-28: LegoBuilder
    if (gameType === 'lego' || gameType === 'builder') {
      if ((!dayData.words || dayData.words.length === 0) && (!dayData.syllables || dayData.syllables.length === 0)) {
        setTimeout(handleGameComplete, 0)
        return null
      }
      return (
        <LegoBuilder
          syllables={dayData.syllables}
          words={dayData.words}
          newLetter={dayData.newLetter}
          onComplete={handleGameComplete}
        />
      )
    }

    // Day 29-30: SentenceReader
    if (gameType === 'sentences') {
      if (!dayData.sentences || dayData.sentences.length === 0) {
        setTimeout(handleGameComplete, 0)
        return null
      }
      return (
        <SentenceReader
          sentences={dayData.sentences}
          onComplete={handleGameComplete}
        />
      )
    }
    
    // Fallbacks
    if (dayData.letters && dayData.letters.length > 0) {
      return (
        <SoundQuiz
          letters={dayData.letters}
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
    
    if (dayData.words && dayData.words.length > 0) {
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
          onClick={() => setPhase('creative')}
          className="px-6 py-3 bg-green-500 text-white rounded-2xl text-lg font-bold"
        >
          Далее →
        </button>
      </div>
    )
  }

  function renderReadingPhase() {
    if (dayData.sentences && dayData.sentences.length > 0) {
      return (
        <SentenceReader
          sentences={dayData.sentences}
          onComplete={handleReadingComplete}
        />
      )
    }

    if (dayData.words && dayData.words.length > 0) {
      return (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Прочитай слова:
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {dayData.words.map((word, i) => (
              <WordReader
                key={`${word}-${i}`}
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
    
    if (dayData.syllables && dayData.syllables.length > 0) {
      return (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Прочитай слоги:
          </h2>
          <SyllableBuilder
            syllables={dayData.syllables}
            mode="build"
            onComplete={handleReadingComplete}
          />
        </div>
      )
    }
    
    handleReadingComplete()
    return null
  }
}
