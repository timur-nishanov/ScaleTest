import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(Draggable, InertiaPlugin)

/**
 * Драг колеса карточек: GSAP Draggable + InertiaPlugin.
 *
 * Договорённость с командой YC: все анимации — чистый GSAP, фабрики без
 * привязки к React, чтобы их можно было перенести в другой код как есть.
 *
 * Прокси-паттерн: невидимый элемент тянется по x, позиция маппится в угол
 * колеса (scrollDeg = -x * degPerPx). Инерция и снап к ближайшей карточке —
 * штатные inertia+snap Draggable.
 */
export interface WheelDragOptions {
  /** Невидимый прокси-элемент, который таскает Draggable. */
  proxy: HTMLElement
  /** Область, с которой начинается драг (контейнер колеса). */
  trigger: HTMLElement
  /** Шаг между карточками, градусы. */
  stepDeg: number
  /** Количество карточек. */
  count: number
  /** Сколько градусов колеса в одном пикселе драга. */
  degPerPx: number
  /** Вызывается на каждый кадр с текущим углом колеса. */
  onScroll: (deg: number) => void
  /**
   * Клик без драга (Draggable сам отличает клик от перетаскивания).
   * Передаём исходный target — снаружи ищут карточку через closest().
   */
  onTap?: (target: Element) => void
  /** Касание колеса (любое) — например, чтобы прервать интро-прогон. */
  onPress?: () => void
}

export const degToX = (deg: number, degPerPx: number) => -deg / degPerPx
export const xToDeg = (x: number, degPerPx: number) => -x * degPerPx

export function createWheelDrag(o: WheelDragOptions): Draggable {
  const maxDeg = (o.count - 1) * o.stepDeg
  const emit = (x: number) => o.onScroll(xToDeg(x, o.degPerPx))

  return Draggable.create(o.proxy, {
    type: 'x',
    trigger: o.trigger,
    inertia: true,
    edgeResistance: 0.78,
    bounds: { minX: degToX(maxDeg, o.degPerPx), maxX: 0 },
    // максимальная длительность доката, чтобы киоск не «уплывал» надолго
    maxDuration: 1.2,
    snap: {
      x: (x: number) => {
        const deg = Math.max(0, Math.min(maxDeg, xToDeg(x, o.degPerPx)))
        return degToX(Math.round(deg / o.stepDeg) * o.stepDeg, o.degPerPx)
      },
    },
    onPress() {
      // палец важнее любых твинов (интро, стрелки)
      gsap.killTweensOf(o.proxy)
      o.onPress?.()
    },
    onDrag() {
      emit(this.x as number)
    },
    onThrowUpdate() {
      emit(this.x as number)
    },
    onClick(e: PointerEvent) {
      if (e.target instanceof Element) o.onTap?.(e.target)
    },
  })[0]
}

/** Твин колеса к карточке index (стрелки, программный снап). */
export function tweenWheelTo(
  proxy: HTMLElement,
  index: number,
  o: Pick<WheelDragOptions, 'stepDeg' | 'count' | 'degPerPx' | 'onScroll'>,
  drag?: Draggable,
) {
  const clamped = Math.max(0, Math.min(o.count - 1, index))
  gsap.killTweensOf(proxy)
  return gsap.to(proxy, {
    x: degToX(clamped * o.stepDeg, o.degPerPx),
    duration: 0.55,
    ease: 'power3.out',
    onUpdate() {
      o.onScroll(xToDeg(Number(gsap.getProperty(proxy, 'x')), o.degPerPx))
    },
    onComplete() {
      drag?.update()
    },
  })
}
