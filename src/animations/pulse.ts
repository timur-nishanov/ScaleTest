import gsap from 'gsap'

/**
 * Пульс CTA на заставке (фидбек артдира: кнопка «Начать» должна
 * привлекать внимание). Мягкий одиночный удар с паузой между циклами.
 *
 * Пульсируем ОБЁРТКУ кнопки: сама кнопка остаётся .pressable —
 * её CSS-скейл нажатия не конфликтует с inline-transform GSAP.
 * Фабрика без React (переносима в код YC).
 */
export function createPulse(
  el: HTMLElement,
  options: { scale?: number; repeatDelay?: number; delay?: number } = {},
): gsap.core.Timeline {
  const scale = options.scale ?? 1.06
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: options.repeatDelay ?? 1.1,
    delay: options.delay ?? 0,
  })
  tl.to(el, { scale, duration: 0.35, ease: 'power2.out' }).to(el, {
    scale: 1,
    duration: 0.5,
    ease: 'power2.inOut',
  })
  return tl
}
