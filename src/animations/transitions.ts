import gsap from 'gsap'

/**
 * Фабрики переходов и микроанимаций. Наполняются на этапе моушена;
 * контракт фиксируем сейчас: чистый GSAP, на вход — DOM-элементы,
 * на выход — tween/timeline. Так команда YC заберёт их к себе как есть.
 */

/** Появление экрана (базовый вариант — заменить на макетный на этапе моушена). */
export function screenEnter(el: Element) {
  return gsap.fromTo(
    el,
    { autoAlpha: 0, y: 40 },
    { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'y' },
  )
}

/** Появление попапа результата (затемнение + модалка). */
export function overlayEnter(dim: Element, modal: Element) {
  const tl = gsap.timeline()
  tl.fromTo(dim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' })
  tl.fromTo(
    modal,
    { autoAlpha: 0, scale: 0.92, y: 40 },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' },
    '<0.05',
  )
  return tl
}

/** Возврат сервиса из слота в палитру и прочие «полёты» — добавим на этапе моушена. */
