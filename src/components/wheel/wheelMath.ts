import { WHEEL_STEP_DEG } from '@/app/config'

/**
 * Геометрия «колеса» карточек (экраны выбора задачи).
 *
 * Карточки стоят на большом виртуальном колесе с пивотом далеко под экраном:
 * центральная — вертикально, соседние повёрнуты на ±15°, ±30° … (шаг из макета).
 * Прокрутка = вращение колеса; см. docs/REFS.md (ponpon-mania, spencergabor).
 *
 * Все значения — в дизайн-пикселях 3840×2160.
 */
export interface WheelLayout {
  /** Радиус колеса: расстояние от пивота до центра карточки. */
  radius: number
  /** X центра сцены. */
  centerX: number
  /** Y верхней кромки центральной карточки. */
  cardTop: number
  cardW: number
  cardH: number
}

/** Значения по макету: центральная карточка 790×1060 @ (1526, 593). */
export const DEFAULT_LAYOUT: WheelLayout = {
  radius: 4000,
  centerX: 1526 + 790 / 2,
  cardTop: 593,
  cardW: 790,
  cardH: 1060,
}

export const STEP = WHEEL_STEP_DEG

/** Градусы колеса на пиксель горизонтального драга (~ширина карточки с зазором = шаг). */
export const DEG_PER_PX = STEP / 820

/** Угол карточки i при положении колеса scrollDeg (0 = первая карточка в центре). */
export function cardAngle(index: number, scrollDeg: number): number {
  return index * STEP - scrollDeg
}

/**
 * CSS-трансформация карточки: поворот вокруг пивота колеса.
 * Пивот лежит на (centerX, cardTop + cardH/2 + radius).
 */
export function cardTransform(index: number, scrollDeg: number, layout = DEFAULT_LAYOUT) {
  const angle = cardAngle(index, scrollDeg)
  const pivotY = layout.cardTop + layout.cardH / 2 + layout.radius
  return {
    angle,
    /** transform-origin в координатах карточки (её левый верх в позиции центральной). */
    transform: `rotate(${angle}deg)`,
    transformOrigin: `${layout.cardW / 2}px ${layout.cardH / 2 + layout.radius}px`,
    left: layout.centerX - layout.cardW / 2,
    top: layout.cardTop,
    pivotY,
  }
}

/** Ближайший индекс карточки для снапа при данном положении колеса. */
export function nearestIndex(scrollDeg: number, count: number): number {
  return Math.max(0, Math.min(count - 1, Math.round(scrollDeg / STEP)))
}

/** Прижать положение колеса к допустимому диапазону (с мягким выходом за край). */
export function clampScroll(scrollDeg: number, count: number, overshoot = STEP * 0.6) {
  const min = -overshoot
  const max = (count - 1) * STEP + overshoot
  return Math.max(min, Math.min(max, scrollDeg))
}
