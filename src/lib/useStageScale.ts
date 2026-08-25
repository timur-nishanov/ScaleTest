import { useEffect, useState } from 'react'
import { DESIGN_W, DESIGN_H } from '@/app/config'

/**
 * Коэффициент вписывания дизайн-сцены 3840×2160 в текущий вьюпорт (letterbox).
 * На целевом 4К-экране = 1, на ноутбуке ~0.5 и т.д.
 */
export function useStageScale() {
  const [scale, setScale] = useState(() => computeScale())

  useEffect(() => {
    const onResize = () => setScale(computeScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return scale
}

function computeScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
}
