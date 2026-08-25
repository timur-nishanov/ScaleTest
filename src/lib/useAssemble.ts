import { useEffect, useRef } from 'react'
import { assembleScreen } from '@/animations/assemble'

/**
 * Сборка кадра при входе на экран (гайд YC, docs/ANIMATIONS.md):
 * повесить ref на корень экрана, элементам проставить data-assemble
 * ("" — кат, "words" — пословно, "click" — стыковка).
 */
export function useAssemble<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tl = assembleScreen(el)
    // ховер-эффекты (CSS transition на transform) включаются только после
    // сборки — иначе transition перехватывает кадры GSAP и переход «рвётся»
    tl.eventCallback('onComplete', () => el.classList.add('is-assembled'))
    return () => {
      tl.kill()
      el.classList.remove('is-assembled')
    }
  }, [])
  return ref
}
