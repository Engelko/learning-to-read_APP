import { getCheckpoints, getTotalDays } from '../data/curriculum'

const CHECKPOINTS = getCheckpoints()
const TOTAL_DAYS = getTotalDays()

const CHARACTERS = {
  dino: { emoji: '🦕', stages: ['🥚', '🐣', '🦕', '🦖'] },
  rocket: { emoji: '🚀', stages: ['🔧', '🔩', '🚀', '🛸'] },
  animal: { emoji: '🦁', stages: ['🐱', '😺', '🦁', '🐯'] }
}

export default function MapScreen({ 
  progress, 
  onSelectDay,
  onContinue 
}) {
  const { currentDay, completedDays, character, childName } = progress
  const char = CHARACTERS[character] || CHARACTERS.dino
  
  const getStepEmoji = (day) => {
    if (completedDays.includes(day)) return '✅'
    if (day === currentDay || (currentDay === 0 && day === 1)) return '🔵'
    if (day > currentDay) return '⬜'
    return '⬜'
  }
  
  const getCharacterStage = () => {
    const percent = (completedDays.length / TOTAL_DAYS) * 100
    if (percent >= 75) return char.stages[3]
    if (percent >= 50) return char.stages[2]
    if (percent >= 25) return char.stages[1]
    return char.stages[0]
  }
  
  const isCheckpoint = (day) => CHECKPOINTS.includes(day)
  
  const canPlayDay = (day) => {
    if (day === 1) return currentDay >= 0
    return day <= currentDay || completedDays.includes(day - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4 flex justify-center">
      <div className="screen-content max-w-4xl">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Дорога приключений
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            {childName}, твой прогресс: {completedDays.length}/{TOTAL_DAYS}
          </p>
          
          <div className="mt-4 max-w-md mx-auto">
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                style={{ width: `${(completedDays.length / TOTAL_DAYS) * 100}%` }}
              />
            </div>
          </div>
        </header>
        
        <div className="flex justify-center mb-8">
          <div className="text-8xl animate-pulse">
            {getCharacterStage()}
          </div>
        </div>
        
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => {
            const day = i + 1
            const canPlay = canPlayDay(day)
            const isCompleted = completedDays.includes(day)
            const isCurrent = day === currentDay || (currentDay === 0 && day === 1)
            const isSpecial = isCheckpoint(day)
            
            return (
              <button
                key={day}
                onClick={() => canPlay && onSelectDay(day)}
                disabled={!canPlay}
                className={`
                  relative aspect-square rounded-2xl text-2xl font-bold
                  transition-all duration-200
                  ${isCompleted 
                    ? 'bg-green-400 text-white shadow-lg' 
                    : ''}
                  ${isCurrent && !isCompleted
                    ? 'bg-blue-400 text-white shadow-lg ring-4 ring-blue-200 animate-pulse' 
                    : ''}
                  ${!canPlay
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : ''}
                  ${isSpecial && canPlay
                    ? 'ring-4 ring-yellow-400' 
                    : ''}
                  hover:scale-105
                `}
              >
                {isCompleted ? '✅' : isSpecial ? '⭐' : day}
                
                {isSpecial && (
                  <div className="absolute -top-1 -right-1 text-sm">
                    🎁
                  </div>
                )}
              </button>
            )
          })}
        </div>
        
        <div className="mt-8 text-center">
          {currentDay === 0 && !completedDays.includes(0) && (
            <button
              onClick={() => onSelectDay(0)}
              className="px-8 py-4 bg-orange-400 text-white rounded-2xl text-xl font-bold
                         hover:bg-orange-500 transition-colors shadow-lg animate-bounce"
            >
              🔍 Начать диагностику
            </button>
          )}
          
          {currentDay > 0 && currentDay <= TOTAL_DAYS && !completedDays.includes(currentDay) && (
            <button
              onClick={() => onSelectDay(currentDay)}
              className="px-8 py-4 bg-green-500 text-white rounded-2xl text-xl font-bold
                         hover:bg-green-600 transition-colors shadow-lg"
            >
              ▶️ Продолжить занятие {currentDay}
            </button>
          )}
          
          {completedDays.length === TOTAL_DAYS && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-green-600">
                Поздравляем! Ты прошёл все занятия!
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-center gap-8 text-4xl">
          <div className="text-center">
            <div>⬜</div>
            <div className="text-sm text-gray-500">Не пройдено</div>
          </div>
          <div className="text-center">
            <div>🔵</div>
            <div className="text-sm text-gray-500">Текущее</div>
          </div>
          <div className="text-center">
            <div>✅</div>
            <div className="text-sm text-gray-500">Пройдено</div>
          </div>
          <div className="text-center">
            <div>⭐</div>
            <div className="text-sm text-gray-500">Приз</div>
          </div>
        </div>
      </div>
    </div>
  )
}
