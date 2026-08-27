import { useFlow } from '@/app/flow'
import { getReadyTask } from '@/data/readyTasks'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { SERVICES } from '@/data/services'
import { TimerBadge } from '@/components/ui/TimerBadge'
import { useTimer } from '@/lib/useTimer'
import { deferNav } from '@/lib/navDelay'
import { useAssemble } from '@/lib/useAssemble'
import { ResultOverlay } from './ResultOverlay'

/**
 * Экран 6 — выбор готового бандла (ветка Б). Макет 11:2265 + стейты.
 *
 * Панель 3660×1474: «Задание», три карточки бандлов 886×958 (заголовок,
 * описание, внизу ряд чипов сервисов с рамкой), подпись-подсказка.
 * Тап по карточке = выбор-ответ, открывается попап результата
 * (отдельного шага подтверждения в макете нет — расхождение с ранним ТЗ
 * зафиксировано в docs/DESIGN-NOTES.md).
 */
export function ReadyScreen() {
  const taskId = useFlow((s) => s.taskId)
  const result = useFlow((s) => s.result)
  const bundleOrder = useFlow((s) => s.bundleOrder)
  const chooseBundle = useFlow((s) => s.chooseBundle)
  const timeoutTask = useFlow((s) => s.timeoutTask)
  const backToTasks = useFlow((s) => s.backToTasks)

  const task = getReadyTask(taskId ?? '')
  const timer = useTimer(!result, timeoutTask)
  const root = useAssemble<HTMLElement>()

  if (!task) return null

  // порядок отображения перемешан при открытии; буквы A/B/C — по позиции
  const order = bundleOrder.length === task.bundles.length
    ? bundleOrder
    : task.bundles.map((_, i) => i)

  return (
    <section ref={root} className="screen screen--ready">
      <Button
        variant="secondary"
        className="nav-back"
        onClick={() => deferNav(backToTasks)}
        data-assemble="static"
      >
        {STRINGS.ready.back}
      </Button>
      <TimerBadge label={timer.label} left={timer.left} warning={timer.warning} />

      <header className="task__top" data-assemble>
        <h1>{task.title}</h1>
        <p>{task.cardDesc}</p>
      </header>

      <div className="ready__panel" data-assemble data-assemble-step="1">
        <div className="ready__assignment">
          <h2>{STRINGS.ready.assignmentLabel}</h2>
          <p>{task.assignment}</p>
        </div>

        <div className="ready__bundles">
          {order.map((origIndex, pos) => {
            const b = task.bundles[origIndex]
            return (
              <article
                key={b.id}
                className="bundle-card pressable"
                onClick={() => deferNav(() => chooseBundle(origIndex))}
              >
                <div className="bundle-card__head">
                  <h3>{`Бандл ${'ABC'[pos] ?? pos + 1}`}</h3>
                  <p>{b.desc}</p>
                </div>
                {b.services.length > 0 && (
                  <div className="bundle-card__services">
                    {b.services.map((id) => (
                      <span className="bundle-chip" key={id}>
                        <ServiceIcon id={id} size={70} variant="tile" />
                        {SERVICES[id].name}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <div className="ready__hint">{STRINGS.ready.chooseHint}</div>
      </div>

      {result && <ResultOverlay />}
    </section>
  )
}
