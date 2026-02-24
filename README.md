# Учись Читать

Интерактивная веб-программа обучения чтению для детей 6 лет.

## Возможности

- 6-недельная программа обучения (~30 занятий)
- Игровая механика с динозаврами, космосом и животными
- Озвучивание букв (как фонемы), слогов и слов
- Яркие анимации и награды
- Сохранение прогресса в localStorage
- Работа без интернета (PWA)

## Технологии

- React 18
- Vite
- Web Speech API (TTS)
- PWA (Service Worker)

## Установка

```bash
npm install
npm run dev
```

## Структура проекта

```
src/
├── components/     # Игровые компоненты
│   ├── LetterCard.jsx
│   ├── FeedingGame.jsx
│   ├── SyllableBuilder.jsx
│   ├── WordReader.jsx
│   ├── SoundQuiz.jsx
│   ├── RocketLaunch.jsx
│   ├── StressMarker.jsx
│   ├── ZooBoard.jsx
│   ├── LegoBuilder.jsx
│   ├── SentenceReader.jsx
│   └── DrawPad.jsx
├── screens/        # Экраны приложения
│   ├── StartScreen.jsx
│   ├── MapScreen.jsx
│   ├── DiagnosticScreen.jsx
│   ├── LessonScreen.jsx
│   └── RewardScreen.jsx
├── services/       # Сервисы
│   └── speech.js   # TTS для русского языка
├── hooks/          # React хуки
│   └── useProgress.js
├── data/           # Данные программы
│   └── curriculum.js
├── App.jsx
├── main.jsx
└── index.css
```

## Педагогическая программа

### День 0 — Диагностика
Проверка 10 букв: А, М, О, У, С, П, К, Т, Л, Н

### Этап 1 — Закрепление букв (Недели 1–2)
- Неделя 1: Динозавры изучают звуки
- Неделя 2: Космические буквы

### Этап 2 — Слоги → слова (Недели 3–4)
- Неделя 3: Животные и насекомые
- Неделя 4: Lego-стройка слов

### Этап 3 — Простые предложения (Недели 5–6)
Тема: Растения и космос

## Лицензия

MIT
