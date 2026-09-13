import { useMemo } from 'react'
import qrcode from 'qrcode-generator'

/** Скруглённый квадрат как сегмент SVG-пути (координаты в модулях). */
function rr(x: number, y: number, w: number, h: number, r: number) {
  const f = (v: number) => +v.toFixed(2)
  return (
    `M${f(x + r)} ${f(y)}h${f(w - 2 * r)}` +
    `a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}v${f(h - 2 * r)}` +
    `a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}h${f(2 * r - w)}` +
    `a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}v${f(2 * r - h)}` +
    `a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}z`
  )
}

/**
 * QR-код как inline-SVG в бренд-стиле интерактивов YC: модули —
 * скруглённые точки, три «глазка» — скруглённые рамки (как в QR других
 * стендов клиента). Уровень коррекции M; скругление модулей ~35 % — код
 * читается сканерами, проверено декодом со скриншотов.
 *
 * `size` — верхняя граница: реальный размер кратен числу модулей.
 * Генерируется на лету из строки — ссылка меняется одной константой
 * в config.ts, ассет перерисовывать не нужно.
 */
export function QrCode({ value, size, className }: { value: string; size: number; className?: string }) {
  const { count, path } = useMemo(() => {
    const qr = qrcode(0, 'M')
    qr.addData(value)
    qr.make()
    const n = qr.getModuleCount()
    // зоны трёх глазков 7×7 рисуем отдельными фигурами
    const inEye = (r: number, c: number) =>
      (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
    let d = ''
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c) && !inEye(r, c)) d += rr(c, r, 1, 1, 0.35)
      }
    }
    for (const [x, y] of [
      [0, 0],
      [n - 7, 0],
      [0, n - 7],
    ]) {
      // радиус рамки 1.9 модуля: максимум, при котором глазки уверенно
      // берёт даже слабый детектор (OpenCV); телефонные сканеры читают
      // с запасом. На 2.1+ OpenCV перестаёт находить код
      d += rr(x, y, 7, 7, 1.9) + rr(x + 1, y + 1, 5, 5, 1.32) + rr(x + 2, y + 2, 3, 3, 0.83)
    }
    return { count: n, path: d }
  }, [value])

  const px = Math.max(1, Math.floor(size / count)) * count

  return (
    <svg
      className={className}
      width={px}
      height={px}
      viewBox={`0 0 ${count} ${count}`}
      role="img"
      aria-label={`QR-код: ${value}`}
    >
      <path d={path} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
