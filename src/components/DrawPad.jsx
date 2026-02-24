import { useState, useRef, useEffect } from 'react'

export default function DrawPad({ letter, onComplete }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.font = 'bold 200px Arial'
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2)
  }, [letter])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    setHasDrawn(true)
    lastPos.current = getPos(e)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e)
    
    ctx.beginPath()
    ctx.strokeStyle = '#4CAF50'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    
    lastPos.current = pos
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      onComplete?.()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.font = 'bold 200px Arial'
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2)
    
    setHasDrawn(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-bold text-gray-700">
        Нарисуй букву {letter} пальцем!
      </div>
      
      <div className="relative border-4 border-gray-300 rounded-2xl overflow-hidden bg-white shadow-lg">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="touch-none w-80 h-80 md:w-96 md:h-96"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={clearCanvas}
          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl text-xl font-bold
                     hover:bg-gray-300 transition-colors shadow-md"
        >
          🗑️ Очистить
        </button>
        
        {hasDrawn && (
          <button
            onClick={() => onComplete?.(true)}
            className="px-8 py-4 bg-green-500 text-white rounded-2xl text-xl font-bold
                       hover:bg-green-600 transition-colors shadow-md animate-bounce"
          >
            ✅ Готово!
          </button>
        )}
      </div>
    </div>
  )
}
