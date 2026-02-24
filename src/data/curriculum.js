export const CURRICULUM = {
  diagnostic: {
    day: 0,
    title: 'Диагностика',
    description: 'Проверка знаний букв',
    letters: ['А', 'М', 'О', 'У', 'С', 'П', 'К', 'Т', 'Л', 'Н']
  },
  
  stage1: {
    title: 'Закрепление букв',
    weeks: [
      {
        week: 1,
        title: 'Динозавры изучают звуки',
        days: [
          {
            day: 1,
            title: 'Звуки А, О, У',
            letters: ['А', 'О', 'У'],
            game: 'roar',
            gameTitle: 'Рёв динозавра',
            creative: 'Нарисовать динозавра с буквой А'
          },
          {
            day: 2,
            title: 'Звуки И, Ы, Э',
            letters: ['И', 'Ы', 'Э'],
            game: 'voice',
            gameTitle: 'Тираннозавр потерял голос',
            creative: 'Написать И и Ы пальцем'
          },
          {
            day: 3,
            title: 'Повтор гласных + М',
            letters: ['А', 'О', 'У', 'И', 'Ы', 'Э', 'М'],
            game: 'catch',
            gameTitle: 'Поймай звук',
            creative: 'Буква М из пластилина'
          },
          {
            day: 4,
            title: 'М + С',
            letters: ['М', 'С'],
            game: 'find',
            gameTitle: 'Найди буквы',
            creative: 'Стегозавр с буквой С'
          },
          {
            day: 5,
            title: 'П, К',
            letters: ['П', 'К'],
            game: 'train',
            gameTitle: 'Паровозик',
            creative: 'Буква К — коготь карнотавра'
          },
          {
            day: 6,
            title: 'Т, Л',
            letters: ['Т', 'Л'],
            game: 'body',
            gameTitle: 'Тело-буква',
            creative: 'Алфавит динозавра'
          },
          {
            day: 7,
            title: 'Н + повторение',
            letters: ['Н', 'А', 'О', 'У', 'И', 'Ы', 'Э', 'М', 'С', 'П', 'К', 'Т', 'Л'],
            game: 'speed',
            gameTitle: 'Кто быстрее',
            creative: 'Итоговая проверка',
            isCheckpoint: true
          }
        ]
      },
      {
        week: 2,
        title: 'Космические буквы',
        days: [
          {
            day: 8,
            title: 'Слоги МА, МО, МУ, МЫ, МИ',
            syllables: ['МА', 'МО', 'МУ', 'МЫ', 'МИ'],
            game: 'rocket',
            gameTitle: 'Запуск ракеты'
          },
          {
            day: 9,
            title: 'Слоги СА, СО, СУ, СЫ',
            syllables: ['СА', 'СО', 'СУ', 'СЫ'],
            game: 'satellite',
            gameTitle: 'Сигналы со спутника'
          },
          {
            day: 10,
            title: 'Первое слово',
            words: ['МАМА', 'САМА'],
            game: 'decode',
            gameTitle: 'Дешифруй послание с Марса'
          },
          {
            day: 11,
            title: 'Слоги ПА, ПО, ПУ',
            syllables: ['ПА', 'ПО', 'ПУ'],
            words: ['ПАПА'],
            game: 'planets',
            gameTitle: 'Планеты — прыгай по слогам'
          },
          {
            day: 12,
            title: 'Слоги КА, КО, КУ',
            syllables: ['КА', 'КО', 'КУ'],
            words: ['КОТ'],
            game: 'spacecat',
            gameTitle: 'Космический кот'
          },
          {
            day: 13,
            title: 'Слоги ТА, ТО, ТУ',
            syllables: ['ТА', 'ТО', 'ТУ'],
            words: ['ТУТ'],
            game: 'signal',
            gameTitle: 'Сигнал найден — кричи ТУТ!'
          },
          {
            day: 14,
            title: 'Итог этапа 1',
            syllables: ['МА', 'МО', 'МУ'],
            words: ['МАМА', 'ПАПА', 'КОТ', 'ТУТ'],
            game: 'exam',
            gameTitle: 'Экзамен капитана',
            isCheckpoint: true,
            isStageComplete: true
          }
        ]
      }
    ]
  },
  
  stage2: {
    title: 'Слоги → слова',
    weeks: [
      {
        week: 3,
        title: 'Животные и насекомые',
        days: [
          {
            day: 15,
            title: 'Слоги ЛА, ЛО, ЛУ',
            syllables: ['ЛА', 'ЛО', 'ЛУ'],
            words: ['ЛАК', 'ЛОМ', 'ЛАМА'],
            game: 'lama',
            gameTitle: 'Лама потеряла имя'
          },
          {
            day: 16,
            title: 'Слоги НА, НО, НУ',
            syllables: ['НА', 'НО', 'НУ'],
            words: ['НОС', 'НАМ', 'СОН'],
            game: 'catfish',
            gameTitle: 'Сом спит?'
          },
          {
            day: 17,
            title: 'Повтор + ударение',
            words: ['ЛАМА', 'МАМА', 'ПАПА'],
            game: 'stress',
            gameTitle: 'Хлопок на ударный слог'
          },
          {
            day: 18,
            title: 'Слоги КА, КО',
            syllables: ['КА', 'КО'],
            words: ['КОТ', 'КОМ', 'КАП'],
            game: 'catball',
            gameTitle: 'Кот поймал ком'
          },
          {
            day: 19,
            title: '3-сложные слова',
            words: ['МА-ЛИ-НА'],
            game: 'raspberry',
            gameTitle: 'Малина для медведя'
          },
          {
            day: 20,
            title: 'Слоги ПА, ПО, ПУ',
            syllables: ['ПА', 'ПО', 'ПУ'],
            words: ['ПАУК'],
            game: 'spider',
            gameTitle: 'Читаем про паука'
          },
          {
            day: 21,
            title: 'Итог недели',
            words: ['МАМА', 'ПАПА', 'КОТ', 'СОМ', 'НОС', 'ЛАМА'],
            game: 'zoo',
            gameTitle: 'Зоопарк из слов',
            isCheckpoint: true
          }
        ]
      },
      {
        week: 4,
        title: 'Lego-стройка слов',
        days: [
          {
            day: 22,
            title: 'Буква В',
            newLetter: 'В',
            syllables: ['ВА', 'ВО', 'ВУ'],
            words: ['ВОЛК'],
            game: 'lego',
            gameTitle: 'Строим слова из блоков'
          },
          {
            day: 23,
            title: 'Буква З',
            newLetter: 'З',
            syllables: ['ЗА', 'ЗО', 'ЗУ'],
            words: ['ЗУБ'],
            game: 'lego',
            gameTitle: 'Строим слова из блоков'
          },
          {
            day: 24,
            title: 'Буква Д',
            newLetter: 'Д',
            syllables: ['ДА', 'ДО', 'ДУ'],
            words: ['ДОМ'],
            game: 'lego',
            gameTitle: 'Строим слова из блоков'
          },
          {
            day: 25,
            title: 'Буква Б',
            newLetter: 'Б',
            syllables: ['БА', 'БО', 'БУ'],
            words: [],
            game: 'lego',
            gameTitle: 'Строим слова из блоков'
          },
          {
            day: 26,
            title: 'Буква Г',
            newLetter: 'Г',
            syllables: ['ГА', 'ГО', 'ГУ'],
            words: [],
            game: 'lego',
            gameTitle: 'Строим слова из блоков'
          },
          {
            day: 27,
            title: 'Буква Р',
            newLetter: 'Р',
            syllables: ['РА', 'РО', 'РУ'],
            words: ['РАК'],
            game: 'lego',
            gameTitle: 'Строим слова из блоков'
          },
          {
            day: 28,
            title: 'Итог этапа 2',
            words: ['МОСТ', 'КУСТ', 'СЛОН', 'ЗУБ', 'ДОМ', 'РАК', 'ВОЛК'],
            game: 'builder',
            gameTitle: 'Мастерская слов',
            isCheckpoint: true,
            isStageComplete: true
          }
        ]
      }
    ]
  },
  
  stage3: {
    title: 'Простые предложения',
    weeks: [
      {
        week: 5,
        title: 'Растения и космос',
        days: [
          {
            day: 29,
            title: 'Предложения 1',
            sentences: ['КОТ СПИТ', 'МАМА ДОМА', 'ВОТ ДОМ'],
            game: 'sentences',
            gameTitle: 'Читаем предложения'
          },
          {
            day: 30,
            title: 'Предложения 2',
            sentences: ['РАК ТУТ', 'СЛОН ЕСТ', 'ПАПА ТУТ'],
            game: 'sentences',
            gameTitle: 'Читаем предложения',
            isCheckpoint: true,
            isStageComplete: true,
            isFinal: true
          }
        ]
      }
    ]
  }
}

export function getDayData(dayNumber) {
  if (dayNumber === 0) {
    return { ...CURRICULUM.diagnostic, type: 'diagnostic' }
  }
  
  const allDays = []
  
  Object.entries(CURRICULUM).forEach(([stageKey, stage]) => {
    stage.weeks.forEach(week => {
      week.days.forEach(day => {
        allDays.push({
          ...day,
          stage: stageKey,
          stageTitle: stage.title,
          weekTitle: week.title,
          week: week.week,
          type: day.game || 'lesson'
        })
      })
    })
  })
  
  return allDays[dayNumber - 1] || null
}

export function getTotalDays() {
  return 30
}

export function getCheckpoints() {
  return [7, 14, 21, 28]
}

export const LETTER_ANIMALS = {
  'А': { animal: 'аист', emoji: '🦢', image: 'https://img.icons8.com/color/200/stork.png' },
  'Б': { animal: 'белка', emoji: '🐿️', image: 'https://img.icons8.com/color/200/squirrel.png' },
  'В': { animal: 'ворона', emoji: '🐦', image: 'https://img.icons8.com/color/200/crow.png' },
  'Г': { animal: 'гусь', emoji: '🦢', image: 'https://img.icons8.com/color/200/goose.png' },
  'Д': { animal: 'дом', emoji: '🏠', image: 'https://img.icons8.com/color/200/home.png' },
  'Е': { animal: 'ель', emoji: '🌲', image: 'https://img.icons8.com/color/200/fir-tree.png' },
  'Ё': { animal: 'ёлка', emoji: '🎄', image: 'https://img.icons8.com/color/200/christmas-tree.png' },
  'Ж': { animal: 'жираф', emoji: '🦒', image: 'https://img.icons8.com/color/200/giraffe.png' },
  'З': { animal: 'змея', emoji: '🐍', image: 'https://img.icons8.com/color/200/snake.png' },
  'И': { animal: 'индюк', emoji: '🦃', image: 'https://img.icons8.com/color/200/turkey.png' },
  'К': { animal: 'кот', emoji: '🐱', image: 'https://img.icons8.com/color/200/cat.png' },
  'Л': { animal: 'лев', emoji: '🦁', image: 'https://img.icons8.com/color/200/lion.png' },
  'М': { animal: 'мамонт', emoji: '🦣', image: 'https://img.icons8.com/color/200/mammoth.png' },
  'Н': { animal: 'носорог', emoji: '🦏', image: 'https://img.icons8.com/color/200/rhinoceros.png' },
  'О': { animal: 'оса', emoji: '🐝', image: 'https://img.icons8.com/color/200/wasp.png' },
  'П': { animal: 'пингвин', emoji: '🐧', image: 'https://img.icons8.com/color/200/penguin.png' },
  'Р': { animal: 'рак', emoji: '🦀', image: 'https://img.icons8.com/color/200/crayfish.png' },
  'С': { animal: 'стегозавр', emoji: '🦕', image: 'https://img.icons8.com/color/200/stegosaurus.png' },
  'Т': { animal: 'тигр', emoji: '🐯', image: 'https://img.icons8.com/color/200/tiger.png' },
  'У': { animal: 'утка', emoji: '🦆', image: 'https://img.icons8.com/color/200/duck.png' },
  'Ф': { animal: 'филин', emoji: '🦉', image: 'https://img.icons8.com/color/200/owl.png' },
  'Х': { animal: 'хомяк', emoji: '🐹', image: 'https://img.icons8.com/color/200/hamster.png' },
  'Ц': { animal: 'цапля', emoji: '🦩', image: 'https://img.icons8.com/color/200/heron.png' },
  'Ч': { animal: 'червяк', emoji: '🪱', image: 'https://img.icons8.com/color/200/earthworm.png' },
  'Ш': { animal: 'шмель', emoji: '🐝', image: 'https://img.icons8.com/color/200/bumblebee.png' },
  'Щ': { animal: 'щука', emoji: '🐟', image: 'https://img.icons8.com/color/200/fish.png' },
  'Ы': { animal: 'рыба', emoji: '🐟', image: 'https://img.icons8.com/color/200/fish.png' },
  'Э': { animal: 'эму', emoji: '🦚', image: 'https://img.icons8.com/color/200/emu.png' },
  'Ю': { animal: 'юла', emoji: '🪀', image: 'https://img.icons8.com/color/200/spinning-top.png' },
  'Я': { animal: 'ящерица', emoji: '🦎', image: 'https://img.icons8.com/color/200/lizard.png' }
}

export const STRESS_MARKS = {
  'МАМА': 'МА́МА',
  'ПАПА': 'ПА́ПА',
  'ЛАМА': 'ЛА́МА',
  'МАЛИНА': 'МАЛИ́НА',
  'ПАУК': 'ПАУ́К',
  'КОТ': 'КОТ',
  'СОМ': 'СОМ',
  'НОС': 'НОС',
  'ДОМ': 'ДОМ',
  'РАК': 'РАК',
  'ЗУБ': 'ЗУБ',
  'ВОЛК': 'ВОЛК',
  'МОСТ': 'МОСТ',
  'КУСТ': 'КУСТ',
  'СЛОН': 'СЛОН',
  'ТУТ': 'ТУТ'
}
