import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useFlow } from '@/app/flow'
import { SERVICES } from '@/data/services'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import type { Outcome, ServiceId } from '@/data/types'

/**
 * Оверлей результата поверх экрана задачи. Макеты — секция Popup states
 * (11:3819, эталон «Собрать самому. Почти. 2 красных» 15:861):
 * карточка 1560 по центру экрана (img-контейнер 1560×472 с иллюстрацией 320
 * по низу, заголовок 96/116, текст 44/56, блок сравнения 1460 r56 с чипами
 * и стрелками, кнопка), справа вплотную (gap 32) — баннер 742:
 * ветка А — промо монеты (все исходы), ветка Б — «Ты заработал монету!»
 * (кроме «Мимо»). В ветке Б в сравнении только «Оптимальная связка».
 */

/** Иллюстрация попапа по исходу (assets/illustrations/popup-*.svg). */
function illustrationFor(outcome: Outcome, mode: 'build' | 'ready') {
  if (outcome === 'correct') return 'popup-success'
  if (outcome === 'timeout') return 'popup-unavailable'
  if (mode === 'ready' && outcome === 'wrong') return 'popup-access-denied'
  return 'popup-not-found' // build «Почти», ready «Почти угадал»
}

export function ResultOverlay() {
  const result = useFlow((s) => s.result)
  const gameMode = useFlow((s) => s.gameMode)
  const backToTasks = useFlow((s) => s.backToTasks)
  const chooseMode = useFlow((s) => s.chooseMode)
  const resetToAttract = useFlow((s) => s.resetToAttract)
  const rootRef = useRef<HTMLDivElement>(null)

  // плавное появление: дим → карточка снизу катом → баннер следом
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const dim = root.querySelector('.overlay__dim')
    const modal = root.querySelector('.result-modal')
    const banner = root.querySelector('.result-banner')
    const tl = gsap.timeline()
    if (dim) tl.fromTo(dim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, 0)
    if (modal)
      tl.fromTo(
        modal,
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'y' },
        0.05,
      )
    if (banner)
      tl.fromTo(
        banner,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', clearProps: 'y' },
        0.2,
      )
    return () => {
      tl.kill()
    }
  }, [])

  if (!result) return null

  // build wrong: все сервисы мимо — отдельные тексты «Не верно!» (док лида)
  const allWrong =
    gameMode === 'build' &&
    result.outcome === 'wrong' &&
    (result.wrongSlots?.length ?? 0) === result.correct.length
  const texts =
    gameMode === 'build'
      ? result.outcome === 'correct'
        ? STRINGS.result.correct
        : result.outcome === 'timeout'
          ? STRINGS.result.timeoutBuild
          : allWrong
            ? STRINGS.result.allWrong
            : STRINGS.result.almost
      : result.outcome === 'correct'
        ? STRINGS.result.readyBest
        : result.outcome === 'partial'
          ? STRINGS.result.readyPartial
          : result.outcome === 'timeout'
            ? STRINGS.result.timeoutReady
            : STRINGS.result.readyWrong

  // neutral — без цветных рамок (ветка Б: связку не «проверяли» по слотам)
  const chipRow = (ids: (ServiceId | null)[], wrongSlots?: number[], neutral = false) => (
    <div className="result-compare__row">
      {ids.map((id, i) => {
        const state = neutral ? '' : wrongSlots?.includes(i) ? 'is-wrong' : 'is-ok'
        const chip =
          id === null ? (
            <span key={`c${i}`} className="result-chip result-chip--empty" />
          ) : (
            <span key={`c${i}`} className={`result-chip ${state}`}>
              <ServiceIcon id={id} size={70} variant="tile" />
              {SERVICES[id].name}
            </span>
          )
        return i > 0
          ? [
              <img
                key={`a${i}`}
                className="result-compare__arrow"
                src="/assets/icons/ui/arrow.svg"
                width={114}
                height={13}
                alt=""
                draggable={false}
              />,
              chip,
            ]
          : chip
      })}
    </div>
  )

  // «Твоя сборка» показываем, только если игрок успел что-то поставить
  // (макет «Время вышло»: при пустых слотах остаётся один ряд)
  const placedAny =
    gameMode === 'build' && result.placedSnapshot?.some((x) => x !== null)

  const ill = illustrationFor(result.outcome, gameMode)

  return (
    <div className="overlay" ref={rootRef}>
      <div className="overlay__dim" />

      <div className={`result-modal result-modal--${result.outcome}`}>
        <div className="result-modal__illbox">
          <img
            src={`/assets/illustrations/${ill}.svg`}
            alt=""
            draggable={false}
            onError={(e) => e.currentTarget.classList.add('is-missing')}
          />
        </div>
        <h2>{texts.title}</h2>
        <p>{texts.msg}</p>

        <div className="result-compare">
          {placedAny && result.placedSnapshot && (
            <div className="result-compare__group">
              <span className="result-compare__label">{STRINGS.result.yourBuild}</span>
              {chipRow(result.placedSnapshot, result.wrongSlots ?? [])}
            </div>
          )}
          <div className="result-compare__group">
            <span className="result-compare__label">
              {gameMode === 'build' ? STRINGS.result.optimalBuild : STRINGS.result.optimalBundle}
            </span>
            {chipRow(result.correct, undefined, gameMode === 'ready')}
          </div>
        </div>

        <div className="result-modal__actions">
          {gameMode === 'build' ? (
            <>
              <Button variant="secondary" onClick={backToTasks}>
                {STRINGS.result.anotherTask}
              </Button>
              <Button variant="secondary" onClick={resetToAttract}>
                {STRINGS.result.finish}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={resetToAttract}>
              {result.outcome === 'correct' || result.outcome === 'timeout'
                ? STRINGS.result.finish
                : STRINGS.result.restart}
            </Button>
          )}
        </div>

        {gameMode === 'build' && (
          <aside className="result-banner">
            <div className="result-banner__circle" aria-hidden>
              <img
                src="/assets/illustrations/coin-circle.svg"
                alt=""
                draggable={false}
                onError={(e) => e.currentTarget.classList.add('is-missing')}
              />
            </div>
            <h3>{STRINGS.result.coinPromo}</h3>
            <Button className="result-banner__cta" onClick={() => chooseMode('ready')}>
              {STRINGS.result.coinPromoCta}
            </Button>
          </aside>
        )}

        {gameMode === 'ready' && result.earnedCoin && (
          <aside className="result-banner">
            <div className="result-banner__circle" aria-hidden>
              <img
                src="/assets/illustrations/coin-circle.svg"
                alt=""
                draggable={false}
                onError={(e) => e.currentTarget.classList.add('is-missing')}
              />
            </div>
            <h3>{STRINGS.result.coinEarned}</h3>
            <p>{STRINGS.result.coinEarnedHint}</p>
          </aside>
        )}
      </div>
    </div>
  )
}
