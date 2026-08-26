import gsap from 'gsap'

/**
 * Сборка кадра при входе на экран — тач-версия принципов гайда YC
 * (7.1: кадр собирается поэлементно, катами, а не плавной трансформацией).
 *
 * Порядок сборки — фидбек артдира: сначала заголовок и текст, потом
 * карточки слева направо. Очередность задаёт атрибут `data-assemble-step`
 * (число; без атрибута — шаг 0), элементы одного шага появляются вместе.
 * `data-assemble="static"` — появление на месте, только фейд (навигация).
 *
 * Тайминги размеренные под большой экран; сборка не блокирует тапы.
 * Фабрика без React (переносима в код YC).
 */
export function assembleScreen(
  root: Element,
  opts: { delay?: number; stepStagger?: number } = {},
): gsap.core.Timeline {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-assemble]'))
  // паузу перед сборкой держим минимальной: ритм смены экранов задаёт
  // затухание предыдущего кадра (useScreenTransition)
  const tl = gsap.timeline({ delay: opts.delay ?? 0.05 })
  if (!items.length) return tl
  const moving = items.filter((el) => el.dataset.assemble !== 'static')
  const still = items.filter((el) => el.dataset.assemble === 'static')
  // спрятать сразу — без вспышки до старта твинов
  gsap.set(items, { autoAlpha: 0 })
  if (still.length) {
    tl.to(still, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0)
  }
  // группировка по шагам, шаги идут каскадом
  const steps = new Map<number, HTMLElement[]>()
  for (const el of moving) {
    const step = Number(el.dataset.assembleStep ?? 0)
    const bucket = steps.get(step)
    if (bucket) bucket.push(el)
    else steps.set(step, [el])
  }
  const stagger = opts.stepStagger ?? 0.16
  Array.from(steps.keys())
    .sort((a, b) => a - b)
    .forEach((step, i) => {
      tl.fromTo(
        steps.get(step)!,
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'y' },
        i * stagger,
      )
    })
  return tl
}
