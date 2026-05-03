import { useState, useEffect, useRef } from 'react'

export function useAnimatedValue(target: number, duration = 480): number {
  const [displayValue, setDisplayValue] = useState(target)
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(target)
  const currentValueRef = useRef(target)

  useEffect(() => {
    startValueRef.current = currentValueRef.current
    startTimeRef.current = null

    if (animRef.current !== null) cancelAnimationFrame(animRef.current)

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const value = startValueRef.current + (target - startValueRef.current) * eased
      currentValueRef.current = value
      setDisplayValue(value)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        currentValueRef.current = target
        setDisplayValue(target)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [target, duration])

  return displayValue
}
