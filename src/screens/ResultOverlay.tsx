import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useFlow } from '@/app/flow'
import { APP_MODE, QR_URL } from '@/app/config'
import { SERVICES } from '@/data/services'
import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { QrCode } from '@/components/ui/QrCode'
import type { Outcome, ServiceId } from '@/data/types'

/**
 * Оверлей результата поверх экрана задачи. Макеты — секция Popup states
 * (11:3819, эталон «Собрать самому. Почти. 2 красных» 15:861):
 * карточка 1560 по центру экрана (img-контейнер 1560×472 с иллюстрацией 320
 * по низу, заголовок 96/116, текст 44/56, блок сравнения 1460 r56 с чипами
 * и стрелками, кнопки), справа вплотную (gap 32) — колонка баннеров 742:
 * ветка А — промо «Хотите печать…» (все исходы), ветка Б — «Вы заработали
 * печать!» (кроме «Мимо»). В ветке Б в сравнении только «Оптимальный бандл».
 *
 * Правая колонка (.result-side) — стопка баннеров одной анатомии: под
 * промо/печатью при любом исходе стоит QR-баннер «Хотите получить
 * материалы…» (заказчик 11.09, размещение — предложение артдира: «в
 * попапе справа, в „Собрать самому“ — под переходом в „Выбрать из
 * готового“»). Композиция «карточка + колонка» центрируется по вертикали
 * целиком. Когда в колонке два баннера, карточка и колонка тянутся друг
 * под друга (низы на одной линии): лишняя высота уходит в «воздух» между
 * блоками — в карточке между сравнением и кнопками, в баннерах между
 * иконкой и текстом, в QR-карточке между подписью и кодом. Когда баннер
 * один (ветка Б без печати) — всё по верхнему краю, без растяжений.
 * Правила — в base.css у .result-layout--stretch.
 */

/** Иллюстрация попапа по исходу (assets/illustrations/popup-*.svg). */
function illustrationFor(outcome: Outcome, mode: 'build' | 'ready', allWrong: boolean) {
  if (outcome === 'correct') return 'popup-success'
  if (outcome === 'timeout') return 'popup-unavailable'
  // «Мимо» и «Не верно» (всё мимо) — красный крест
  if (allWrong || (mode === 'ready' && outcome === 'wrong')) return 'popup-access-denied'
  return 'popup-not-found' // build «Почти», ready «Почти угадали»
}

export function ResultOverlay() {
  const result = useFlow((s) => s.result)
  const gameMode = useFlow((s) => s.gameMode)
  const backToTasks = useFlow((s) => s.backToTasks)
  const chooseMode = useFlow((s) => s.chooseMode)
  const resetToAttract = useFlow((s) => s.resetToAttract)
  const rootRef = useRef<HTMLDivElement>(null)

  // все чипы сравнения одной высоты: ряды «Ваша сборка» и «Оптимальная»
  // не отличаются, даже когда длинное имя даёт лишнюю строку (замер в
  // offsetHeight — это дизайн-пиксели, скейл Stage на них не влияет)
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const chips = Array.from(root.querySelectorAll<HTMLElement>('.result-chip'))
    if (chips.length < 2) return
    const max = Math.max(...chips.map((c) => c.offsetHeight))
    for (const c of chips) c.style.minHeight = `${max}px`
  }, [])

  // плавное появление: дим → карточка снизу катом → баннер следом
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const dim = root.querySelector('.overlay__dim')
    const modal = root.querySelector('.result-modal')
    const banners = root.querySelectorAll('.result-banner')
    const tl = gsap.timeline()
    if (dim) tl.fromTo(dim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, 0)
    if (modal)
      tl.fromTo(
        modal,
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'y' },
        0.05,
      )
    if (banners.length)
      tl.fromTo(
        banners,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.1, clearProps: 'y' },
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

  // neutral — без цветных рамок (ветка Б: связку не «проверяли» по слотам).
  // С четырёх чипов ряд переходит в компактный режим: иначе длинные имена
  // («…for ClickHouse®») не помещаются и вылезают за рамку чипа
  const chipRow = (ids: (ServiceId | null)[], wrongSlots?: number[], neutral = false) => {
    const tight = ids.length >= 4
    return (
      <div className={`result-compare__row ${tight ? 'result-compare__row--tight' : ''}`}>
        {ids.map((id, i) => {
          const state = neutral ? '' : wrongSlots?.includes(i) ? 'is-wrong' : 'is-ok'
          const chip =
            id === null ? (
              <span key={`c${i}`} className="result-chip result-chip--empty" />
            ) : (
              <span key={`c${i}`} className={`result-chip ${state}`}>
                <ServiceIcon id={id} size={tight ? 56 : 70} variant="tile" />
                {SERVICES[id].name}
              </span>
            )
          return i > 0
            ? [
                <img
                  key={`a${i}`}
                  className="result-compare__arrow"
                  src="/assets/icons/ui/arrow.svg"
                  width={tight ? 60 : 114}
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
  }

  // «Твоя сборка» показываем, только если игрок успел что-то поставить
  // (макет «Время вышло»: при пустых слотах остаётся один ряд)
  const placedAny =
    gameMode === 'build' && result.placedSnapshot?.some((x) => x !== null)

  const ill = illustrationFor(result.outcome, gameMode, allWrong)

  // вариант QR-карточки: фиолетовая с белой плашкой или белая с кодом
  // на карточке. Демо-выбор для заказчика (тумблер внизу слева), решение
  // запоминается на устройстве; после решения оставить один вариант
  const [qrVariant, setQrVariant] = useState<'accent' | 'light'>(() => {
    try {
      return localStorage.getItem('qrCardVariant') === 'light' ? 'light' : 'accent'
    } catch {
      return 'accent'
    }
  })
  const pickQrVariant = (v: 'accent' | 'light') => {
    setQrVariant(v)
    try {
      localStorage.setItem('qrCardVariant', v)
    } catch {
      /* приватный режим — живёт до перезагрузки */
    }
  }

  // в колонке два баннера (промо/печать + QR) — карточка и колонка
  // подстраиваются друг под друга; один баннер — выравнивание по верху
  const stacked = gameMode === 'build' || result.earnedCoin

  return (
    <div className="overlay" ref={rootRef}>
      <div className="overlay__dim" />

      <div className={`result-layout ${stacked ? 'result-layout--stretch' : ''}`}>
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

          {/* кнопки едины для обеих веток (решение заказчика 26.08):
              «Выбрать другую задачу» → колесо, «Завершить» → заставка */}
          <div className="result-modal__actions">
            <Button variant="secondary" onClick={backToTasks}>
              {STRINGS.result.anotherTask}
            </Button>
            <Button variant="secondary" onClick={resetToAttract}>
              {STRINGS.result.finish}
            </Button>
          </div>

        </div>

        <div className="result-side">
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
              <p>{STRINGS.result.coinPromoHint}</p>
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

          {/* QR-баннер — при любом исходе обеих веток (продуктовый лид, 11.09).
              В веб-версии пользователь и так у экрана — плашка ещё и ссылка */}
          <aside
          className={`result-banner result-banner--qr ${
            qrVariant === 'light' ? 'result-banner--qr-light' : ''
          }`}
        >
            <h3>{STRINGS.result.qrTitle}</h3>
            <p>{STRINGS.result.qrHint}</p>
            {APP_MODE === 'web' ? (
              <a className="result-qr" href={QR_URL} target="_blank" rel="noopener">
                <QrCode value={QR_URL} size={352} className="result-qr__code" />
              </a>
            ) : (
              <div className="result-qr">
                <QrCode value={QR_URL} size={352} className="result-qr__code" />
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* демо-тумблер: выбор варианта QR-карточки, убрать после решения */}
      <div className="qr-variant-toggle">
        <span>QR-карточка</span>
        <button
          type="button"
          className={qrVariant === 'accent' ? 'is-on' : ''}
          onClick={() => pickQrVariant('accent')}
        >
          Фиолетовая
        </button>
        <button
          type="button"
          className={qrVariant === 'light' ? 'is-on' : ''}
          onClick={() => pickQrVariant('light')}
        >
          Белая
        </button>
      </div>
    </div>
  )
}
