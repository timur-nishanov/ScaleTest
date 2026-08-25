import { useFlow } from '@/app/flow'
import { BUILD_TASKS } from '@/data/buildTasks'
import { READY_TASKS } from '@/data/readyTasks'
import { STRINGS } from '@/data/strings'
import { FLAGS } from '@/app/config'
import { Button } from '@/components/ui/Button'
import { WheelCarousel } from '@/components/wheel/WheelCarousel'

/**
 * Экраны 3/5 — выбор бизнес-задачи (обе ветки). Макеты 2334:4845 и 2334:5831.
 * Карточки — колесо с интро-прокруткой (аннотация артдира, docs/REFS.md).
 */
export function TaskSelectScreen() {
  const gameMode = useFlow((s) => s.gameMode)
  const openTask = useFlow((s) => s.openTask)
  const openRandomTask = useFlow((s) => s.openRandomTask)
  const backToMode = useFlow((s) => s.backToMode)

  const tasks = gameMode === 'build' ? BUILD_TASKS : READY_TASKS
  const showRandom = gameMode === 'build' || FLAGS.randomInReadyMode

  return (
    <section className="screen screen--task-select">
      <Button variant="secondary" className="nav-back" onClick={backToMode}>
        {STRINGS.taskSelect.back}
      </Button>

      {showRandom && (
        <Button variant="secondary" className="nav-random" onClick={openRandomTask}>
          {STRINGS.taskSelect.random} 🎲
        </Button>
      )}

      <header className="screen__top">
        <div className="screen__label">
          {gameMode === 'build' ? STRINGS.taskSelect.buildLabel : STRINGS.taskSelect.readyLabel}
        </div>
        <h1>{STRINGS.taskSelect.title}</h1>
        <p>
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
              <div className="task-card__ill" data-task={t.id} />
            </article>
          )
        }}
      />
    </section>
  )
}
