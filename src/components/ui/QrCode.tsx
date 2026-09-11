import { useMemo } from 'react'
import qrcode from 'qrcode-generator'

/**
 * QR-код как inline-SVG: чёрные модули на прозрачном фоне, размер задаёт
 * родитель через `size`. Генерируется на лету из строки — ссылка меняется
 * одной константой в config.ts, ассет перерисовывать не нужно.
 * Уровень коррекции M: хватает для экрана киоска, модули крупнее, чем при H.
 */
export function QrCode({ value, size, className }: { value: string; size: number; className?: string }) {
  const { count, path } = useMemo(() => {
    const qr = qrcode(0, 'M')
    qr.addData(value)
    qr.make()
    const n = qr.getModuleCount()
    let d = ''
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
      }
    }
    return { count: n, path: d }
  }, [value])

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${count} ${count}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR-код"
    >
      <path d={path} fill="currentColor" />
    </svg>
  )
}
