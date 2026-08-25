import gsap from 'gsap'

/**
 * Сборка кадра при входе на экран — упрощённая тач-версия принципов гайда YC
 * (7.1: кадр собирается поэлементно, катами, а не плавной трансформацией).
 *
 * На тач-киоске анимация не должна заставлять ждать: один быстрый групповой
 * кат с коротким стаггером по [data-assemble]-элементам (порядок = DOM),
 * вся сборка укладывается в ~полсекунды и не блокирует тапы.
 *
 * Фабрика без React (переносима в код YC).
 */
export function assembleScreen(
  root: Element,
  opts: { stagger?: number; delay?: number } = {},
): gsap.core.Tween | gsap.core.Timeline {
  const items = root.querySelectorAll<HTMLElement>('[data-assemble]')
  if (!items.length) return gsap.timeline()
  // чистый кат без движения (фидбек заказчика: «подтягивание» элементов
  // резало глаз) — появление на месте, последовательность задаёт стаггер;
  // небольшая пауза перед сборкой, чтобы смена экрана не была встык
  gsap.set(items, { autoAlpha: 0 })
  return gsap.to(items, {
    autoAlpha: 1,
    duration: 0.22,
    ease: 'power1.out',
    delay: opts.delay ?? 0.05,
    stagger: opts.stagger ?? 0.04,
    overwrite: 'auto',
  })
}
