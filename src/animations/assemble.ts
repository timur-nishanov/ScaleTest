import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/**
 * Принципы моушена из гайда YC (раздел 7.1 «Принципы анимации»):
 * композиция собирается ПОСЛЕДОВАТЕЛЬНО, ПОЭЛЕМЕНТНО — «акцентированная сборка
 * кадра», а не плавная трансформация.
 *
 * — «Появление»: детали появляются резким катом с лёгким инерционным движением.
 * — «Соединение»: элементы стыкуются через короткий соединительный «клик».
 * — «Типографика»: текст появляется катами, пословно — каждое слово доезжает.
 *
 * Фабрики без React (переносимы в код YC): на вход DOM-элементы, на выход timeline.
 */

/** Резкий кат с лёгкой инерцией: элемент появляется быстро, чуть доезжая. */
export function cutIn(el: Element, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { autoAlpha: 0, y: 60 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.32,
      ease: 'back.out(1.6)',
      clearProps: 'y',
      ...vars,
    },
  )
}

/** Соединительный «клик»: элемент встаёт на место с коротким панчем. */
export function clickIn(el: Element, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { autoAlpha: 0, scale: 0.6 },
    {
      autoAlpha: 1,
      scale: 1,
      duration: 0.26,
      ease: 'back.out(2.4)',
      clearProps: 'scale',
      ...vars,
    },
  )
}

/**
 * Типографика: текст появляется катами, пословно — каждое слово доезжает.
 * Возвращает timeline; SplitText ревертится по завершении (DOM чистый).
 */
export function wordsIn(el: Element, vars: { stagger?: number; delay?: number } = {}) {
  const split = SplitText.create(el, { type: 'words' })
  // слова прячутся сразу при создании сборки — без вспышки до старта твина
  gsap.set(split.words, { autoAlpha: 0 })
  const tl = gsap.timeline({
    delay: vars.delay ?? 0,
    onComplete: () => split.revert(),
  })
  tl.fromTo(
    split.words,
    { autoAlpha: 0, x: -40 },
    {
      autoAlpha: 1,
      x: 0,
      duration: 0.3,
      ease: 'power3.out',
      stagger: vars.stagger ?? 0.07,
    },
  )
  return tl
}

/**
 * Сборка кадра: элементы с data-assemble появляются последовательно катами,
 * [data-assemble="words"] — пословно, [data-assemble="click"] — «кликом».
 * Порядок = порядок в DOM; шаг между элементами короткий, чтобы читалось
 * как монтаж, а не как каскадный fade.
 */
export function assembleScreen(root: Element, opts: { step?: number } = {}) {
  const step = opts.step ?? 0.09
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-assemble]'))
  // спрятать все элементы сборки сразу (words прячут свои слова сами)
  gsap.set(
    items.filter((el) => el.dataset.assemble !== 'words'),
    { autoAlpha: 0 },
  )
  const tl = gsap.timeline()
  items.forEach((el, i) => {
    const mode = el.dataset.assemble
    const at = i * step
    if (mode === 'words') {
      tl.add(wordsIn(el), at)
    } else if (mode === 'click') {
      tl.add(clickIn(el), at)
    } else {
      tl.add(cutIn(el), at)
    }
  })
  return tl
}
