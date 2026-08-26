import gsap from 'gsap'

/**
 * Пульс CTA на заставке (фидбек артдира: кнопка «Начать» должна
 * привлекать внимание). Непрерывное «дыхание» — плавная синусоида
 * scale 1 ↔ 1.06 без пауз между циклами.
 *
 * Пульсируем ОБЁРТКУ кнопки: сама кнопка остаётся .pressable —
 * её CSS-скейл нажатия не конфликтует с inline-transform GSAP.
 * Фабрика без React (переносима в код YC).
 */
export function createPulse(
  el: HTMLElement,
  options: { scale?: number; period?: number; delay?: number } = {},
): gsap.core.Tween {
  return gsap.to(el, {
    scale: options.scale ?? 1.06,
    duration: (options.period ?? 1.8) / 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: options.delay ?? 0,
  })
}
