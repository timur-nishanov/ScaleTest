import gsap from 'gsap'

/**
 * Сборка кадра при входе на экран — тач-версия принципов гайда YC
 * (7.1: кадр собирается поэлементно, катами, а не плавной трансформацией).
 *
 * Два вида ката (порядок = DOM, короткий стаггер):
 * - data-assemble          — кат с лёгким инерционным движением (небольшой y);
 * - data-assemble="static" — появление на месте, только фейд: навигационные
 *   кнопки и лого не должны «подтягиваться» (точечный фидбек заказчика).
 *
 * Вся сборка укладывается в ~полсекунды и не блокирует тапы.
 * Фабрика без React (переносима в код YC).
 */
export function assembleScreen(
  root: Element,
  opts: { stagger?: number; delay?: number } = {},
): gsap.core.Timeline {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-assemble]'))
  const tl = gsap.timeline({ delay: opts.delay ?? 0.05 })
  if (!items.length) return tl
  // спрятать сразу — без вспышки до старта твинов
  gsap.set(items, { autoAlpha: 0 })
  const step = opts.stagger ?? 0.05
  items.forEach((el, i) => {
    const at = i * step
    if (el.dataset.assemble === 'static') {
      tl.fromTo(
        el,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2, ease: 'power1.out' },
        at,
      )
    } else {
      tl.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out', clearProps: 'y' },
        at,
      )
    }
  })
  return tl
}
