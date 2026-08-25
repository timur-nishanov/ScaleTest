import { TIMER_SECONDS } from '@/app/config'

interface Props {
  label: string
  /** Оставшиеся секунды — для дуги прогресса по контуру пилюли. */
  left: number
  warning: boolean
}

/* геометрия пилюли таймера из макета: 297×128, radius 38 */
const W = 297
const H = 128
const R = 38
/* периметр скруглённого прямоугольника */
const PERIMETER = 2 * (W - 2 * R) + 2 * (H - 2 * R) + 2 * Math.PI * R

/**
 * Таймер в шапке (макет: белая пилюля с будильником и mm:ss; по контуру —
 * дуга прогресса, тающая со временем; последние 10 с — красный стейт).
 */
export function TimerBadge({ label, left, warning }: Props) {
  const progress = Math.max(0, Math.min(1, left / TIMER_SECONDS))
  // старт дуги — верхняя середина, по часовой
  const d = `M ${W / 2} 2
    H ${W - R} A ${R - 2} ${R - 2} 0 0 1 ${W - 2} ${R}
    V ${H - R} A ${R - 2} ${R - 2} 0 0 1 ${W - R} ${H - 2}
    H ${R} A ${R - 2} ${R - 2} 0 0 1 2 ${H - R}
    V ${R} A ${R - 2} ${R - 2} 0 0 1 ${R} 2 Z`
  return (
    <div className={`timer-badge ${warning ? 'is-warning' : ''}`}>
      <svg className="timer-badge__ring" viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {/* дуга показывает ПРОШЕДШЕЕ время (по макету: в начале — короткая
            дуга у старта, к концу контур замыкается) */}
        <path
          d={d}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={PERIMETER}
          strokeDashoffset={PERIMETER * progress}
        />
      </svg>
      <span className="timer-badge__icon" aria-hidden />
      <span className="timer-badge__label">{label}</span>
    </div>
  )
}
