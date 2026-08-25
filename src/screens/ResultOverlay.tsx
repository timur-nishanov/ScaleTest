import { useFlow } from '@/app/flow'
import { SERVICES } from '@/data/services'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'

/**
 * Оверлей результата поверх экрана задачи. Макеты — секция 2334:6135 «Popup states»
 * (по вариантам исходов и числу сервисов в ряду), плюс промо-карточка монеты
 * справа в ветке А.
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
          ? STRINGS.result.timeout
          : STRINGS.result.almost
      : result.outcome === 'correct'
        ? STRINGS.result.readyBest
        : result.outcome === 'partial'
          ? STRINGS.result.readyPartial
          : result.outcome === 'timeout'
            ? STRINGS.result.timeout
            : STRINGS.result.readyWrong

  return (
    <div className="overlay">
      <div className="overlay__dim" />

      <div className={`result-modal result-modal--${result.outcome}`}>
        <div className="result-modal__ill" data-outcome={result.outcome} />
        <h2>{texts.title}</h2>
        <p>{texts.msg}</p>

        {gameMode === 'build' && result.placedSnapshot && (
          <div className="result-compare">
            <div className="result-compare__row">
              <span className="result-compare__label">{STRINGS.result.yourBuild}</span>
              {result.placedSnapshot.map((id, i) =>
                id ? (
                  <span
                    key={i}
                    className={`result-chip ${result.wrongSlots?.includes(i) ? 'is-wrong' : 'is-ok'}`}
                  >
                    <ServiceIcon id={id} size={48} />
                    {SERVICES[id].name}
                  </span>
                ) : null,
              )}
            </div>
            <div className="result-compare__row">
              <span className="result-compare__label">{STRINGS.result.optimal}</span>
              {result.correct.map((id) => (
                <span key={id} className="result-chip is-ok">
                  <ServiceIcon id={id} size={48} />
                  {SERVICES[id].name}
                </span>
              ))}
            </div>
          </div>
        )}

        {gameMode === 'ready' && (
          <div className="result-compare">
            <div className="result-compare__row">
              <span className="result-compare__label">{STRINGS.result.optimal}</span>
              {result.correct.map((id) => (
                <span key={id} className="result-chip is-ok">
                  <ServiceIcon id={id} size={48} />
                  {SERVICES[id].name}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.earnedCoin && (
          <div className="result-coin">
            <strong>🪙 {STRINGS.result.coinEarned}</strong>
            <p>{STRINGS.result.coinEarnedHint}</p>
          </div>
        )}

        <div className="result-modal__actions">
          {gameMode === 'build' ? (
            <Button onClick={backToTasks}>{STRINGS.result.anotherTask}</Button>
          ) : (
            <Button onClick={resetToAttract}>{STRINGS.result.finish}</Button>
          )}
        </div>
      </div>

      {gameMode === 'build' && (
        <aside className="coin-promo">
          <div className="coin-promo__star" aria-hidden>★</div>
          <p>{STRINGS.result.coinPromo}</p>
          <Button onClick={() => chooseMode('ready')}>{STRINGS.result.coinPromoCta}</Button>
        </aside>
      )}
    </div>
  )
}
