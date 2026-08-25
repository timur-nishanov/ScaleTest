import { useFlow } from '@/app/flow'
import { SERVICES } from '@/data/services'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import type { ServiceId } from '@/data/types'

/**
 * Оверлей результата поверх экрана задачи. Макеты — секция Popup states:
 * модалка 1560px (иллюстрация, заголовок, текст, блок сравнения, кнопка)
 * + боковой баннер #9572ff: в ветке А — промо монеты (все исходы),
 * в ветке Б — «Ты заработал монету!» (кроме «Мимо»).
 *
 * Кнопки по макету: ветка А — «Выбрать другую задачу»;
 * ветка Б — «Завершить» (best/timeout) или «Начать заново» (partial/wrong).
 */
export function ResultOverlay() {
  const result = useFlow((s) => s.result)
  const gameMode = useFlow((s) => s.gameMode)
  const backToTasks = useFlow((s) => s.backToTasks)
  const chooseMode = useFlow((s) => s.chooseMode)
  const resetToAttract = useFlow((s) => s.resetToAttract)

  if (!result) return null

  const texts =
    gameMode === 'build'
      ? result.outcome === 'correct'
        ? STRINGS.result.correct
        : result.outcome === 'timeout'
          ? STRINGS.result.timeoutBuild
          : STRINGS.result.almost
      : result.outcome === 'correct'
        ? STRINGS.result.readyBest
        : result.outcome === 'partial'
          ? STRINGS.result.readyPartial
          : result.outcome === 'timeout'
            ? STRINGS.result.timeoutReady
            : STRINGS.result.readyWrong

  const chipRow = (ids: (ServiceId | null)[], wrongSlots?: number[]) => (
    <div className="result-compare__row">
      {ids.map((id, i) => {
        if (id === null) {
          return <span key={i} className="result-chip result-chip--empty" />
        }
        const state = wrongSlots ? (wrongSlots.includes(i) ? 'is-wrong' : 'is-ok') : 'is-ok'
        return (
          <span key={i} className={`result-chip ${state}`}>
            <ServiceIcon id={id} size={70} variant="tile" />
            {SERVICES[id].name}
          </span>
        )
      })}
    </div>
  )

  return (
    <div className="overlay">
      <div className="overlay__dim" />

      <div className={`result-modal result-modal--${result.outcome}`}>
        <div className="result-modal__ill" data-outcome={result.outcome} />
        <h2>{texts.title}</h2>
        <p>{texts.msg}</p>

        <div className="result-compare">
          {gameMode === 'build' && result.placedSnapshot && (
            <div className="result-compare__group">
              <span className="result-compare__label">{STRINGS.result.yourBuild}</span>
              {chipRow(result.placedSnapshot, result.wrongSlots ?? [])}
            </div>
          )}
          <div className="result-compare__group">
            <span className="result-compare__label">{STRINGS.result.optimal}</span>
            {chipRow(result.correct)}
          </div>
        </div>

        <div className="result-modal__actions">
          {gameMode === 'build' ? (
            <Button variant="secondary" onClick={backToTasks}>
              {STRINGS.result.anotherTask}
            </Button>
          ) : (
            <Button variant="secondary" onClick={resetToAttract}>
              {result.outcome === 'correct' || result.outcome === 'timeout'
                ? STRINGS.result.finish
                : STRINGS.result.restart}
            </Button>
          )}
        </div>
      </div>

      {gameMode === 'build' && (
        <aside className="coin-promo">
          <div className="coin-promo__star" aria-hidden>★</div>
          <h3>{STRINGS.result.coinPromo}</h3>
          <Button onClick={() => chooseMode('ready')}>{STRINGS.result.coinPromoCta}</Button>
        </aside>
      )}

      {gameMode === 'ready' && result.earnedCoin && (
        <aside className="coin-promo">
          <div className="coin-promo__star" aria-hidden>★</div>
          <h3>{STRINGS.result.coinEarned}</h3>
          <p>{STRINGS.result.coinEarnedHint}</p>
        </aside>
      )}
    </div>
  )
}
