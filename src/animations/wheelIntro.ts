import gsap from 'gsap'
import { degToX, xToDeg } from './wheelDrag'

/**
 * Интро колеса (аннотация артдира, реф lionsgoodnews.com/article01):
 * при появлении экрана карточки плавно прокручиваются от первой до последней,
 * затем колесо возвращается к карточке endIndex (середина колоды — как стоит
 * колесо в макете, чтобы слева не было пустого пространства).
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
  /** Длительности прогона туда/обратно, сек — тюнить на железе. */
  forwardDuration?: number
  backDuration?: number
}

export function createWheelIntro(o: WheelIntroOptions): gsap.core.Timeline {
  const maxDeg = (o.count - 1) * o.stepDeg
  const endDeg = (o.endIndex ?? 0) * o.stepDeg
  const emit = () =>
    o.onScroll(xToDeg(Number(gsap.getProperty(o.proxy, 'x')), o.degPerPx))

  const tl = gsap.timeline()
  tl.to(o.proxy, {
    x: degToX(maxDeg, o.degPerPx),
    duration: o.forwardDuration ?? 2.6,
    ease: 'power1.inOut',
    onUpdate: emit,
  }).to(o.proxy, {
    x: degToX(endDeg, o.degPerPx),
    duration: o.backDuration ?? 2.2,
    ease: 'power1.inOut',
    onUpdate: emit,
  })
  return tl
}
