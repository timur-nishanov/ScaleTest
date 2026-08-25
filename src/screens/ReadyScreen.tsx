import { useFlow } from '@/app/flow'
import { getReadyTask } from '@/data/readyTasks'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { SERVICES } from '@/data/services'
import { TimerBadge } from '@/components/ui/TimerBadge'
import { useTimer } from '@/lib/useTimer'
import { ResultOverlay } from './ResultOverlay'

/**
 * Экран 6 — выбор готового бандла (ветка Б). Макет 2334:4582 + стейты.
 *
 * По макету три карточки бандлов с описаниями видны сразу,
 * тап по карточке = выбор-ответ (отдельного шага подтверждения в макете нет —
 * расхождение с ранним ТЗ зафиксировано в docs/DESIGN-NOTES.md).
 */
export function ReadyScreen() {
  const taskId = useFlow((s) => s.taskId)
  const result = useFlow((s) => s.result)
  const chooseBundle = useFlow((s) => s.chooseBundle)
  const timeoutTask = useFlow((s) => s.timeoutTask)
  const backToTasks = useFlow((s) => s.backToTasks)

  const task = getReadyTask(taskId ?? '')
  const timer = useTimer(!result, timeoutTask)

  if (!task) return null

  return (
    <section className="screen screen--ready">
      <Button variant="secondary" className="nav-back" onClick={backToTasks}>
        {STRINGS.ready.back}
      </Button>
      <TimerBadge label={timer.label} warning={timer.warning} />

      <header className="screen__top">
        <h1>{task.title}</h1>
        <p>{task.cardDesc}</p>
      </header>

      <div className="ready__panel">
        <div className="ready__assignment">
          <h2>{STRINGS.ready.assignmentLabel}</h2>
          <p>{task.assignment}</p>
        </div>

        <div className="ready__bundles">
          {task.bundles.map((b) => (
            <article
              key={b.name}
              className="bundle-card pressable"
              onClick={() => chooseBundle(b.name)}
            >
              <h3>{b.name}</h3>
              <p>{b.desc}</p>
              <div className="bundle-card__services">
                {b.services.map((id) => (
                  <span className="bundle-chip" key={id}>
                    <ServiceIcon id={id} size={56} />
                    {SERVICES[id].name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="ready__hint">{STRINGS.ready.chooseHint}</div>
      </div>

      {result && <ResultOverlay />}
    </section>
  )
}
