import { useEffect, useRef, useState } from 'react'
import { TIMER_SECONDS, TIMER_WARN_SECONDS } from '@/app/config'

/**
 * Обратный отсчёт задачи. Стартует при монтировании, останавливается,
 * когда running=false (показан результат) или размонтирован экран.
 */
export function useTimer(running: boolean, onEnd: () => void) {
  const [left, setLeft] = useState(TIMER_SECONDS)
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd

  useEffect(() => {
    if (!running) return
    const startedAt = performance.now()
    const id = setInterval(() => {
      const elapsed = Math.floor((performance.now() - startedAt) / 1000)
      const next = Math.max(0, TIMER_SECONDS - elapsed)
      setLeft(next)
      if (next <= 0) {
        clearInterval(id)
        onEndRef.current()
      }
    }, 250)
    return () => clearInterval(id)
  }, [running])

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return { left, label: `${mm}:${ss}`, warning: left <= TIMER_WARN_SECONDS }
}
