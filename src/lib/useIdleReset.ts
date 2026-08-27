import { useEffect, useRef, useState } from 'react'
import { FLAGS, IDLE_PROMPT_AFTER_S, IDLE_RESET_AFTER_S } from '@/app/config'

/**
 * Автосброс по бездействию (ТЗ): после IDLE_PROMPT_AFTER_S простоя — попап
 * «Вы ещё здесь?», ещё через IDLE_RESET_AFTER_S без действий — сброс на
 * заставку. При FLAGS.idlePrompt=false попап скрыт (решение заказчика 27.08):
 * отсчёт идёт единым таймером на сумму обоих интервалов.
 *
 * enabled=false на attract-экране. Любой pointerdown сбрасывает отсчёт.
 * Возвращает showPrompt + stay() для кнопки «Да» (перезаряжает отсчёт).
 */
export function useIdleReset(enabled: boolean, onReset: () => void) {
  const [showPrompt, setShowPrompt] = useState(false)
  const onResetRef = useRef(onReset)
  onResetRef.current = onReset
  const armRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!enabled) {
      setShowPrompt(false)
      armRef.current = () => {}
      return
    }
    let promptTimer: number | undefined
    let resetTimer: number | undefined

    const arm = () => {
      window.clearTimeout(promptTimer)
      window.clearTimeout(resetTimer)
      setShowPrompt(false)
      if (!FLAGS.idlePrompt) {
        resetTimer = window.setTimeout(
          () => onResetRef.current(),
          (IDLE_PROMPT_AFTER_S + IDLE_RESET_AFTER_S) * 1000,
        )
        return
      }
      promptTimer = window.setTimeout(() => {
        setShowPrompt(true)
        resetTimer = window.setTimeout(() => {
          setShowPrompt(false)
          onResetRef.current()
        }, IDLE_RESET_AFTER_S * 1000)
      }, IDLE_PROMPT_AFTER_S * 1000)
    }
    armRef.current = arm

    arm()
    // pointerdown в capture-фазе: любое касание где угодно продлевает сессию
    window.addEventListener('pointerdown', arm, true)
    return () => {
      window.clearTimeout(promptTimer)
      window.clearTimeout(resetTimer)
      window.removeEventListener('pointerdown', arm, true)
    }
  }, [enabled])

  return { showPrompt, stay: () => armRef.current() }
}
