import gsap from 'gsap'
import { degToX, xToDeg } from './wheelDrag'

/**
 * Интро колеса (фидбек артдира 26.08): колесо стартует с последней карточки
 * и одним прогоном прокручивается к первой — на ней и останавливается.
 * Показывается один раз за загрузку страницы (флаг держит WheelCarousel).
 *
 * Прерывается снаружи (gsap.killTweensOf(proxy) в onPress Draggable —
 * палец всегда важнее).
 */
export interface WheelIntroOptions {
  proxy: HTMLElement
  stepDeg: number
  count: number
  degPerPx: number
  onScroll: (deg: number) => void
  /** Карточка, на которой колесо останавливается после прогона. */
  endIndex?: number
  /** Длительность прогона, сек — тюнить на железе. */
  duration?: number
}

export function createWheelIntro(o: WheelIntroOptions): gsap.core.Timeline {
  const endDeg = (o.endIndex ?? 0) * o.stepDeg
  const emit = () =>
    o.onScroll(xToDeg(Number(gsap.getProperty(o.proxy, 'x')), o.degPerPx))

  const tl = gsap.timeline()
  tl.to(o.proxy, {
    x: degToX(endDeg, o.degPerPx),
    duration: o.duration ?? 2.2,
    ease: 'power2.inOut',
    onUpdate: emit,
  })
  return tl
}
