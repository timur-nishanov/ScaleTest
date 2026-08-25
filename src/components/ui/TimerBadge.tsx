interface Props {
  label: string
  warning: boolean
}

/** Бейдж таймера в шапке (макет: пилюля с иконкой будильника, красная зона ≤10 с). */
export function TimerBadge({ label, warning }: Props) {
  return (
    <div className={`timer-badge ${warning ? 'is-warning' : ''}`}>
      <span className="timer-badge__icon" aria-hidden>⏰</span>
      <span className="timer-badge__label">{label}</span>
    </div>
  )
}
