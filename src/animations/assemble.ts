import gsap from 'gsap'

/**
 * Сборка кадра при входе на экран — тач-версия принципов гайда YC
 * (7.1: кадр собирается поэлементно, катами, а не плавной трансформацией).
 *
 * Кадр появляется ЦЕЛИКОМ, одним катом — без стаггера-«лесенки»
 * (фидбек заказчика). Два вида элементов:
 * - data-assemble          — кат с лёгким инерционным движением (небольшой y);
 * - data-assemble="static" — появление на месте, только фейд (навигация, лого).
 *
 * Тайминги размеренные под большой экран; сборка не блокирует тапы.
 * Фабрика без React (переносима в код YC).
 */
export function assembleScreen(
  root: Element,
  opts: { delay?: number } = {},
): gsap.core.Timeline {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-assemble]'))
  const tl = gsap.timeline({ delay: opts.delay ?? 0.1 })
  if (!items.length) return tl
  const moving = items.filter((el) => el.dataset.assemble !== 'static')
  const still = items.filter((el) => el.dataset.assemble === 'static')
  // спрятать сразу — без вспышки до старта твинов
  gsap.set(items, { autoAlpha: 0 })
  if (still.length) {
    tl.to(still, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0)
  }
  if (moving.length) {
    tl.fromTo(
      moving,
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'y' },
      0,
    )
  }
  return tl
}
