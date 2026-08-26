import { useFlow } from '@/app/flow'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { useAssemble } from '@/lib/useAssemble'
import { deferNav } from '@/lib/navDelay'

/**
 * Экран 2 — выбор режима. Макет 11:604, вёрстка 1:1.
 * Вход — быстрая сборка кадра (упрощённая тач-версия гайда, docs/ANIMATIONS.md).
 */
export function ModeScreen() {
  const chooseMode = useFlow((s) => s.chooseMode)
  const resetToAttract = useFlow((s) => s.resetToAttract)
  const root = useAssemble<HTMLElement>()

  return (
    <section ref={root} className="screen screen--mode">
      <Button variant="secondary" className="nav-back" onClick={() => deferNav(resetToAttract)} data-assemble="static">
        {STRINGS.mode.back}
      </Button>

      <header className="mode__top">
        <h1 data-assemble>{STRINGS.mode.title}</h1>
        <p data-assemble>{STRINGS.mode.subtitle}</p>
      </header>

      {/* порядок сборки (фидбек артдира): заголовок → левая → правая */}
      <div
        className="mode-card mode-card--build pressable"
        onClick={() => deferNav(() => chooseMode('build'))}
        data-assemble
        data-assemble-step="1"
      >
        <img
          className="mode-card__ill"
          src="/assets/illustrations/mode-build.svg"
          alt=""
          draggable={false}
        />
        <div className="mode-card__text">
          <h2>{STRINGS.mode.build.title}</h2>
          <p>{STRINGS.mode.build.desc}</p>
        </div>
      </div>

      <div
        className="mode-card mode-card--ready pressable"
        onClick={() => deferNav(() => chooseMode('ready'))}
        data-assemble
        data-assemble-step="2"
      >
        <img
          className="mode-card__ill"
          src="/assets/illustrations/mode-ready.svg"
          alt=""
          draggable={false}
        />
        <div className="mode-card__text mode-card__text--ready">
          <div>
            <h2>{STRINGS.mode.ready.title}</h2>
            <p>{STRINGS.mode.ready.desc}</p>
          </div>
          <span className="mode-card__coin">{STRINGS.mode.ready.coinBadge}</span>
        </div>
      </div>
    </section>
  )
}
