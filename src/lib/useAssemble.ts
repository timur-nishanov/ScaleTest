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
    if (!ref.current) return
    const tl = assembleScreen(ref.current)
    return () => {
      tl.kill()
    }
  }, [])
  return ref
}
