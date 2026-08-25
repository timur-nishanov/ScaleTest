import { TIMER_SECONDS } from '@/app/config'

interface Props {
  label: string
  /** Оставшиеся секунды — для дуги прогресса по контуру пилюли. */
  left: number
  warning: boolean
}

/* геометрия пилюли таймера из макета: 297×128, radius 38, обводка 8 */
const W = 297
const H = 128
const R = 38
const SW = 8
const INSET = SW / 2 // обводка целиком внутри пилюли
const AR = R - INSET // радиус дуги скругления по средней линии обводки
/* фактическая длина контура (прямые участки + четыре четверти окружности) */
const PATH_LEN = 2 * (W - 2 * R) + 2 * (H - 2 * R) + 2 * Math.PI * AR

/**
 * Таймер в шапке (макет: белая пилюля с будильником и mm:ss; по контуру —
 * дуга прогресса, тающая со временем; последние 10 с — красный стейт).
 * Иконка и текст позиционированы абсолютно, чтобы не смещались при смене цифр.
 */
export function TimerBadge({ label, left, warning }: Props) {
  const progress = Math.max(0, Math.min(1, left / TIMER_SECONDS))
  // старт дуги — верхняя середина, по часовой
  const d = `M ${W / 2} ${INSET}
    H ${W - R} A ${AR} ${AR} 0 0 1 ${W - INSET} ${R}
    V ${H - R} A ${AR} ${AR} 0 0 1 ${W - R} ${H - INSET}
    H ${R} A ${AR} ${AR} 0 0 1 ${INSET} ${H - R}
    V ${R} A ${AR} ${AR} 0 0 1 ${R} ${INSET} Z`
  return (
    <div className={`timer-badge ${warning ? 'is-warning' : ''}`}>
      <svg className="timer-badge__ring" viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {/* дуга показывает ПРОШЕДШЕЕ время (по макету: в начале — короткая
            дуга у старта, к концу контур замыкается) */}
        <path
          d={d}
          fill="none"
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={PATH_LEN}
          strokeDashoffset={PATH_LEN * progress}
        />
      </svg>
      <span className="timer-badge__icon" aria-hidden />
      <span className="timer-badge__label">{label}</span>
    </div>
  )
}
