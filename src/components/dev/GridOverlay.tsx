import { useEffect, useState } from 'react'

/**
 * Дев-оверлей колоночной сетки макета: 12 колонок, margin 90, gutter 60,
 * цвет FF0000 10% (настройки Columns из Figma). Для сверки вёрстки 1:1.
 *
 * Включение: клавиша «g» или ?grid=1 в адресе. На киоске клавиатуры нет —
 * в проде оверлей не мешает.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(
    () => typeof location !== 'undefined' && new URLSearchParams(location.search).has('grid'),
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') setVisible((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!visible) return null

  return (
    <div className="grid-overlay" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="grid-overlay__col" />
      ))}
    </div>
  )
}
