import { useLayoutEffect, useRef } from 'react'

/** Верх панели по макету и минимальный зазор до шапки (дизайн-пиксели). */
const PANEL_TOP_DESIGN = 596
const HEADER_TOP = 120
const GAP = 56

/**
 * Панель экрана задачи не должна налезать на шапку.
 *
 * Финальные тексты лида в 3–4 раза длиннее макетных, и обрезать их нельзя
 * (решение заказчика 27.08). Поэтому шапка рендерится целиком, а панель
 * отъезжает вниз ровно настолько, насколько шапка выросла: верх панели —
 * CSS-переменная `--panel-top`, высота считается от фиксированного низа.
 * Пока шапка помещается в макетные габариты, всё стоит как нарисовано.
 */
export function useHeaderFit<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const header = root.querySelector<HTMLElement>('.task__top')
    if (!header) return

    const apply = () => {
      // offsetHeight — в дизайн-пикселях: скейл Stage применён к предку
      const bottom = HEADER_TOP + header.offsetHeight
      const top = Math.max(PANEL_TOP_DESIGN, Math.round(bottom + GAP))
      root.style.setProperty('--panel-top', `${top}px`)
    }

    apply()
    // шрифты догружаются асинхронно — пересчитываем, когда текст «сядет»
    const ro = new ResizeObserver(apply)
    ro.observe(header)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
