import { useState, useCallback } from 'react'

const CLICK_THRESHOLD = 5
const EMOJI_COUNT = 50

export function useEasterEgg() {
  const [, setClickCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  const triggerEasterEgg = useCallback(() => {
    setClickCount((prev) => {
      const newCount = prev + 1
      if (newCount === CLICK_THRESHOLD) {
        setShowEasterEgg(true)
        setTimeout(() => setShowEasterEgg(false), 8000)
        return 0
      }
      return newCount
    })
  }, [])

  const EasterEggComponent = () => {
    if (!showEasterEgg) return null

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(EMOJI_COUNT)].map((_, index) => (
          <div
            key={index}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 1}s`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `rotate(-45deg)`,
            }}
          >
            🚀
          </div>
        ))}
      </div>
    )
  }

  return { triggerEasterEgg, EasterEggComponent }
}
