import { useFlow } from '@/app/flow'
import { BUILD_TASKS } from '@/data/buildTasks'
import { READY_TASKS } from '@/data/readyTasks'
import { STRINGS } from '@/data/strings'
import { FLAGS } from '@/app/config'
import { Button } from '@/components/ui/Button'
import { WheelCarousel } from '@/components/wheel/WheelCarousel'
import { useAssemble } from '@/lib/useAssemble'
import { deferNav } from '@/lib/navDelay'

/**
 * Экраны 3/5 — выбор бизнес-задачи (обе ветки). Макеты 11:2528 и 11:3515.
 * Карточки — колесо с интро-прокруткой; шапка — быстрая сборка кадра.
 */
export function TaskSelectScreen() {
  const gameMode = useFlow((s) => s.gameMode)
  const openTask = useFlow((s) => s.openTask)
  const openRandomTask = useFlow((s) => s.openRandomTask)
  const backToMode = useFlow((s) => s.backToMode)
  const taskWheelIndex = useFlow((s) => s.taskWheelIndex)
  const root = useAssemble<HTMLElement>()

  const tasks = gameMode === 'build' ? BUILD_TASKS : READY_TASKS
  const showRandom = gameMode === 'build' || FLAGS.randomInReadyMode

  return (
    <section ref={root} className="screen screen--task-select">
      <Button variant="secondary" className="nav-back" onClick={() => deferNav(backToMode)} data-assemble="static">
        {STRINGS.taskSelect.back}
      </Button>

      {showRandom && (
        <Button variant="secondary" className="nav-random" onClick={() => deferNav(openRandomTask)} data-assemble="static">
          {STRINGS.taskSelect.random}
          <img src="/assets/icons/dice-5.svg" width={44} height={44} alt="" draggable={false} />
        </Button>
      )}

      <header className="select__top">
        <div className="select__label" data-assemble>
          {gameMode === 'build' ? STRINGS.taskSelect.buildLabel : STRINGS.taskSelect.readyLabel}
        </div>
        <div className="select__title-row" data-assemble>
          <h1>{STRINGS.taskSelect.title}</h1>
          {/* в ветке Б рядом с заголовком чип «Монета за конкурс» (макет 11:3515) */}
          {gameMode === 'ready' && (
            <span className="select__coin">{STRINGS.mode.ready.coinBadge}</span>
          )}
        </div>
        <p data-assemble>
          {gameMode === 'build'
            ? STRINGS.taskSelect.buildSubtitle
            : STRINGS.taskSelect.readySubtitle}
        </p>
      </header>

      <WheelCarousel
        count={tasks.length}
        initialIndex={taskWheelIndex}
        onPick={(i) => deferNav(() => openTask(tasks[i].id))}
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
