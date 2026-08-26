import gsap from 'gsap'

/**
 * Бесшовная бегущая строка (теги на заставке).
 * Трек содержит ДВЕ одинаковые копии контента; линейный твин xPercent 0→-50
 * с бесконечным повтором даёт бесшовный цикл.
 *
 * speed — дизайн-пиксели в секунду (медленное движение по решению артдира);
 * startDelay — пауза перед стартом, сек: первый тег успевает считаться,
 * дальше строка плавно разгоняется до крейсерской скорости.
 */
export function createMarquee(
  track: HTMLElement,
  options: { speed?: number; startDelay?: number } = {},
) {
  const speed = options.speed ?? 60
  const startDelay = options.startDelay ?? 0
  // точный период цикла — расстояние между началами двух копий (ширина ряда + gap)
  const first = track.children[0] as HTMLElement | undefined
  const second = track.children[1] as HTMLElement | undefined
  const period =
    first && second ? second.offsetLeft - first.offsetLeft : track.scrollWidth / 2
  if (period <= 0) return gsap.to(track, {})
  const tween = gsap.to(track, {
    x: -period,
    duration: period / speed,
    ease: 'none',
    repeat: -1,
  })
  if (startDelay > 0) {
    // мягкий разгон вместо рывка с места
    tween.timeScale(0)
    gsap.to(tween, { timeScale: 1, duration: 1, ease: 'power1.in', delay: startDelay })
  }
  return tween
}
