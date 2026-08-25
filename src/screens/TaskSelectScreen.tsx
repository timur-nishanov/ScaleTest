import { useFlow } from '@/app/flow'
import { BUILD_TASKS } from '@/data/buildTasks'
import { READY_TASKS } from '@/data/readyTasks'
import { STRINGS } from '@/data/strings'
import { FLAGS } from '@/app/config'
import { Button } from '@/components/ui/Button'
import { WheelCarousel } from '@/components/wheel/WheelCarousel'
import { useAssemble } from '@/lib/useAssemble'

/** Иконка кубика для «Случайный выбор» (гравити-стиль, 5 точек). */
function DiceIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="9" stroke="currentColor" strokeWidth="3" />
      <circle cx="14.5" cy="14.5" r="3" fill="currentColor" />
      <circle cx="29.5" cy="14.5" r="3" fill="currentColor" />
      <circle cx="22" cy="22" r="3" fill="currentColor" />
      <circle cx="14.5" cy="29.5" r="3" fill="currentColor" />
      <circle cx="29.5" cy="29.5" r="3" fill="currentColor" />
    </svg>
  )
}

/**
 * Экраны 3/5 — выбор бизнес-задачи (обе ветки). Макеты 11:2528 и 11:3515.
 * Карточки — колесо с интро-прокруткой; шапка — быстрая сборка кадра.
 */
export function TaskSelectScreen() {
  const gameMode = useFlow((s) => s.gameMode)
  const openTask = useFlow((s) => s.openTask)
  const openRandomTask = useFlow((s) => s.openRandomTask)
  const backToMode = useFlow((s) => s.backToMode)
  const root = useAssemble<HTMLElement>()

  const tasks = gameMode === 'build' ? BUILD_TASKS : READY_TASKS
  const showRandom = gameMode === 'build' || FLAGS.randomInReadyMode

  return (
    <section ref={root} className="screen screen--task-select">
      <Button variant="secondary" className="nav-back" onClick={backToMode} data-assemble>
        {STRINGS.taskSelect.back}
      </Button>

      {showRandom && (
        <Button variant="secondary" className="nav-random" onClick={openRandomTask} data-assemble>
          {STRINGS.taskSelect.random}
          <DiceIcon />
        </Button>
      )}

      <header className="select__top">
        <div className="select__label" data-assemble>
          {gameMode === 'build' ? STRINGS.taskSelect.buildLabel : STRINGS.taskSelect.readyLabel}
        </div>
        <h1 data-assemble>{STRINGS.taskSelect.title}</h1>
        <p data-assemble>
          {gameMode === 'build'
            ? STRINGS.taskSelect.buildSubtitle
            : STRINGS.taskSelect.readySubtitle}
        </p>
      </header>

      <WheelCarousel
        count={tasks.length}
        onPick={(i) => openTask(tasks[i].id)}
        renderCard={(i) => {
          const t = tasks[i]
          return (
            <article className="task-card">
              <div className="task-card__type">{t.type}</div>
              <h3 className="task-card__title">{t.title}</h3>
              <p className="task-card__desc">{t.cardDesc}</p>
              <img
                className="task-card__ill"
                src={`/assets/illustrations/kv_${t.kv}.svg`}
                alt=""
                draggable={false}
              />
            </article>
          )
        }}
      />
    </section>
  )
}
