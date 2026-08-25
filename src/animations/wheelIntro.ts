import gsap from 'gsap'
import { degToX, xToDeg } from './wheelDrag'

/**
 * Интро колеса (аннотация артдира, реф lionsgoodnews.com/article01):
 * при появлении экрана карточки прокручиваются от первой до последней
 * и возвращаются к первой, после чего управление отдаётся пользователю.
 *
 * Возвращает timeline; прерывается снаружи (gsap.killTweensOf(proxy)
 * в onPress Draggable — палец всегда важнее).
 */
export interface WheelIntroOptions {
  proxy: HTMLElement
  stepDeg: number
  count: number
  degPerPx: number
  onScroll: (deg: number) => void
  /** Длительности прогона туда/обратно, сек — тюнить на железе. */
  forwardDuration?: number
  backDuration?: number
}

export function createWheelIntro(o: WheelIntroOptions): gsap.core.Timeline {
  const maxDeg = (o.count - 1) * o.stepDeg
  const emit = () =>
    o.onScroll(xToDeg(Number(gsap.getProperty(o.proxy, 'x')), o.degPerPx))

  const tl = gsap.timeline()
  tl.to(o.proxy, {
    x: degToX(maxDeg, o.degPerPx),
    duration: o.forwardDuration ?? 1.5,
    ease: 'power2.inOut',
    onUpdate: emit,
  }).to(o.proxy, {
    x: 0,
    duration: o.backDuration ?? 1.3,
    ease: 'power2.inOut',
    onUpdate: emit,
  })
  return tl
}
