import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Плавная смена экранов: уходящий кадр быстро гаснет, и только потом
 * маунтится следующий (его элементы собирает useAssemble/assembleScreen).
 * Убирает «жёсткий кат» между экранами: движение непрерывно —
 * нажатие → затухание → сборка нового кадра.
 */
export function useScreenTransition<T extends string>(target: T, duration = 0.22) {
  const [displayed, setDisplayed] = useState(target)
  const hostRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) {
      setDisplayed(target)
      return
    }
    if (target === displayed) {
      // новый экран смонтирован (или смену отменили на полпути) — хост видим
      gsap.set(host, { autoAlpha: 1 })
      return
    }
    const tween = gsap.to(host, {
      autoAlpha: 0,
      duration,
      ease: 'power1.in',
      overwrite: 'auto',
      onComplete: () => setDisplayed(target),
    })
    return () => {
      tween.kill()
    }
  }, [target, displayed, duration])

  return { displayed, hostRef }
}
