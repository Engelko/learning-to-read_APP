const SPEECH_CONFIG = {
  lang: 'ru-RU',
  rate: 0.7,
  pitch: 1.0,
  volume: 1.0
}

const LETTER_PHONEMES = {
  'А': { sound: 'а', example: 'ааа' },
  'Б': { sound: 'б', example: 'банан' },
  'В': { sound: 'в', example: 'ворон' },
  'Г': { sound: 'г', example: 'город' },
  'Д': { sound: 'д', example: 'дом' },
  'Е': { sound: 'е', example: 'ель' },
  'Ё': { sound: 'ё', example: 'ёлка' },
  'Ж': { sound: 'ж', example: 'жук' },
  'З': { sound: 'з', example: 'зонт' },
  'И': { sound: 'и', example: 'игра' },
  'Й': { sound: 'й', example: 'йогурт' },
  'К': { sound: 'к', example: 'кот' },
  'Л': { sound: 'л', example: 'лампа' },
  'М': { sound: 'м', example: 'мама' },
  'Н': { sound: 'н', example: 'нос' },
  'О': { sound: 'о', example: 'осы' },
  'П': { sound: 'п', example: 'папа' },
  'Р': { sound: 'р', example: 'рак' },
  'С': { sound: 'с', example: 'сом' },
  'Т': { sound: 'т', example: 'тут' },
  'У': { sound: 'у', example: 'утка' },
  'Ф': { sound: 'ф', example: 'флаг' },
  'Х': { sound: 'х', example: 'хлеб' },
  'Ц': { sound: 'ц', example: 'цирк' },
  'Ч': { sound: 'ч', example: 'чай' },
  'Ш': { sound: 'ш', example: 'шар' },
  'Щ': { sound: 'щ', example: 'щука' },
  'Ъ': { sound: '', example: '' },
  'Ы': { sound: 'ы', example: 'рыба' },
  'Ь': { sound: '', example: '' },
  'Э': { sound: 'э', example: 'это' },
  'Ю': { sound: 'ю', example: 'юла' },
  'Я': { sound: 'я', example: 'ягода' }
}

class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis
    this.isInitialized = false
    this.voices = []
    this.russianVoice = null
    this.audioContext = null
    this.isUnlocked = false
  }

  async init() {
    if (this.isInitialized) return
    
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth.getVoices()
        this.russianVoice = this.voices.find(v => 
          v.lang.includes('ru') && v.name.includes('Google')
        ) || this.voices.find(v => v.lang.includes('ru'))
        
        this.isInitialized = true
        resolve()
      }

      if (this.synth.getVoices().length > 0) {
        loadVoices()
      } else {
        this.synth.addEventListener('voiceschanged', loadVoices, { once: true })
        setTimeout(() => {
          if (!this.isInitialized) {
            loadVoices()
          }
        }, 1000)
      }
    })
  }

  unlockAudio() {
    if (this.isUnlocked) return true
    
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      } catch (e) {
        console.warn('AudioContext not supported')
      }
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    this.isUnlocked = true
    return true
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      this.synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = options.lang || SPEECH_CONFIG.lang
      utterance.rate = options.rate || SPEECH_CONFIG.rate
      utterance.pitch = options.pitch || SPEECH_CONFIG.pitch
      utterance.volume = options.volume || SPEECH_CONFIG.volume

      if (this.russianVoice) {
        utterance.voice = this.russianVoice
      }

      utterance.onend = () => resolve()
      utterance.onerror = (e) => reject(e)

      this.synth.speak(utterance)
    })
  }

  speakLetter(letter) {
    const phoneme = LETTER_PHONEMES[letter.toUpperCase()]
    if (!phoneme) {
      return this.speak(letter, { rate: 0.6 })
    }
    return this.speak(phoneme.sound, { rate: 0.5, pitch: 1.1 })
  }

  speakSyllable(syllable) {
    return this.speak(syllable, { rate: 0.65, pitch: 1.0 })
  }

  speakWord(word) {
    return this.speak(word, { rate: 0.6, pitch: 1.0 })
  }

  speakSentence(sentence) {
    return this.speak(sentence, { rate: 0.7, pitch: 1.0 })
  }

  speakEncouragement(type = 'success') {
    const phrases = {
      success: ['Молодец!', 'Отлично!', 'Супер!', 'Умница!', 'Правильно!'],
      encourage: ['Попробуй ещё!', 'Почти получилось!', 'Давай вместе!'],
      reward: ['Ура!', 'Ты справился!', 'Так держать!']
    }
    
    const list = phrases[type] || phrases.success
    const phrase = list[Math.floor(Math.random() * list.length)]
    return this.speak(phrase, { rate: 0.8, pitch: 1.2 })
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  isSupported() {
    return 'speechSynthesis' in window
  }
}

export const speechService = new SpeechService()
export { LETTER_PHONEMES }
