import { useFlow } from '@/app/flow'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { useAssemble } from '@/lib/useAssemble'

/**
 * Экран 2 — выбор режима. Макет 11:604, вёрстка 1:1.
 * Вход — сборка кадра по гайду: кнопка и заголовок катами (заголовок пословно),
 * карточки катами, чип «Монета за конкурс» — соединительным «кликом».
 */
export function ModeScreen() {
  const chooseMode = useFlow((s) => s.chooseMode)
  const resetToAttract = useFlow((s) => s.resetToAttract)
  const root = useAssemble<HTMLElement>()

  return (
    <section ref={root} className="screen screen--mode">
      <Button variant="secondary" className="nav-back" onClick={resetToAttract} data-assemble>
        {STRINGS.mode.back}
      </Button>

      <header className="mode__top">
        <h1 data-assemble="words">{STRINGS.mode.title}</h1>
        <p data-assemble>{STRINGS.mode.subtitle}</p>
      </header>

      <div
        className="mode-card mode-card--build pressable"
        onClick={() => chooseMode('build')}
        data-assemble
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
        onClick={() => chooseMode('ready')}
        data-assemble
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
          <span className="mode-card__coin" data-assemble="click">
            {STRINGS.mode.ready.coinBadge}
          </span>
        </div>
      </div>
    </section>
  )
}
