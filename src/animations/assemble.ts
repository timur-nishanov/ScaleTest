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
  opts: { stagger?: number } = {},
): gsap.core.Tween | gsap.core.Timeline {
  const items = root.querySelectorAll<HTMLElement>('[data-assemble]')
  if (!items.length) return gsap.timeline()
  return gsap.fromTo(
    items,
    { autoAlpha: 0, y: 40 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.28,
      ease: 'power2.out',
      stagger: opts.stagger ?? 0.05,
      clearProps: 'y',
      overwrite: 'auto',
    },
  )
}
