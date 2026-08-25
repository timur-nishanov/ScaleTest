import { useFlow } from '@/app/flow'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'

/**
 * Экран 2 — выбор режима. Макет 2334:3041 (+ стейты 2340:38935).
 * Две карточки: «Собрать самому» / «Выбрать из готового» (с чипом «Монета за конкурс»).
 */
export function ModeScreen() {
  const chooseMode = useFlow((s) => s.chooseMode)
  const resetToAttract = useFlow((s) => s.resetToAttract)

  return (
    <section className="screen screen--mode">
      <Button variant="secondary" className="nav-back" onClick={resetToAttract}>
        {STRINGS.mode.back}
      </Button>

      <header className="screen__top">
        <h1>{STRINGS.mode.title}</h1>
        <p>{STRINGS.mode.subtitle}</p>
      </header>

      <div className="mode__cards">
        <div className="mode-card pressable" onClick={() => chooseMode('build')}>
          <div className="mode-card__ill" data-ill="build" />
          <h2>{STRINGS.mode.build.title}</h2>
          <p>{STRINGS.mode.build.desc}</p>
        </div>

        <div className="mode-card pressable" onClick={() => chooseMode('ready')}>
          <div className="mode-card__ill" data-ill="ready" />
          <h2>{STRINGS.mode.ready.title}</h2>
          <p>{STRINGS.mode.ready.desc}</p>
          <span className="mode-card__coin">{STRINGS.mode.ready.coinBadge}</span>
        </div>
      </div>
    </section>
  )
}
