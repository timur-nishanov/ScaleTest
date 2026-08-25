/**
 * Задержка перед сменой экрана (фидбек заказчика: мгновенный кат — резко).
 * Тап → короткая пауза, за которую пресс-стейт 0.94 успевает отыграться, →
 * переход. Повторные тапы во время паузы игнорируются.
 */
export const NAV_DELAY_MS = 180

let pending = false

export function deferNav(action: () => void, delayMs = NAV_DELAY_MS) {
  if (pending) return
  pending = true
  window.setTimeout(() => {
    pending = false
    action()
  }, delayMs)
}
