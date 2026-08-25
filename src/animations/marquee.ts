import gsap from 'gsap'

/**
 * Бесшовная бегущая строка (теги на заставке).
 * Трек содержит ДВЕ одинаковые копии контента; линейный твин xPercent 0→-50
 * с бесконечным повтором даёт бесшовный цикл.
 *
 * speed — дизайн-пиксели в секунду (медленное движение по решению артдира).
 */
export function createMarquee(track: HTMLElement, options: { speed?: number } = {}) {
  const speed = options.speed ?? 60
  // точный период цикла — расстояние между началами двух копий (ширина ряда + gap)
  const first = track.children[0] as HTMLElement | undefined
  const second = track.children[1] as HTMLElement | undefined
  const period =
    first && second ? second.offsetLeft - first.offsetLeft : track.scrollWidth / 2
  if (period <= 0) return gsap.to(track, {})
  return gsap.to(track, {
    x: -period,
    duration: period / speed,
    ease: 'none',
    repeat: -1,
  })
}
