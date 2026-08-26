import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import type { Draggable } from 'gsap/Draggable'
import { DEG_PER_PX, STEP, cardAngle, cardTransform } from './wheelMath'
import { createWheelDrag, degToX, tweenWheelTo, xToDeg } from '@/animations/wheelDrag'
import { createWheelIntro } from '@/animations/wheelIntro'

/**
 * Колесо карточек (см. docs/REFS.md и docs/ANIMATIONS.md):
 * 1) интро — прокрутка по всем карточкам и возврат (реф lionsgoodnews);
 * 2) свободный драг с инерцией и снапом (Draggable + InertiaPlugin);
 * 3) стрелки — шаг на соседнюю карточку; 4) тап по карточке = выбор.
 *
 * Анимации — чистый GSAP (договорённость с командой YC, фабрики в
 * src/animations). React рендерит карточки один раз; углы на каждый кадр
 * пишет GSAP напрямую в transform — без ре-рендеров (важно для 60fps на 4К).
 */
interface Props {
  count: number
  renderCard: (index: number) => ReactNode
  onPick: (index: number) => void
  /**
   * Стартовая карточка: null/undefined — свежий вход, играем интро-прогон;
   * число — возврат «Назад» из задачи, колесо сразу стоит на этой карточке.
   */
  initialIndex?: number | null
}

// интро показываем один раз за загрузку страницы (фидбек артдира) —
// дальше колесо сразу стоит на первой карточке
let introShownThisPageLoad = false

export function WheelCarousel({ count, renderCard, onPick, initialIndex }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const proxyRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const introActive = useRef(true)
  const applyRef = useRef<(deg: number) => void>(() => {})
  const onPickRef = useRef(onPick)
  onPickRef.current = onPick
  // стартовая позиция фиксируется на маунте: обновление стора при выборе
  // карточки не должно передёргивать колесо во время смены экрана
  const startIndexRef = useRef(initialIndex)

  useEffect(() => {
    const proxy = proxyRef.current
    const root = rootRef.current
    if (!proxy || !root) return

    const apply = (deg: number) => {
      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const angle = cardAngle(i, deg)
        // карточки за пределами ~100° от центра не видны — не считаем их
        if (Math.abs(angle) > 100) {
          el.style.visibility = 'hidden'
          continue
        }
        el.style.visibility = 'visible'
        gsap.set(el, { rotation: angle })
      }
    }

    applyRef.current = apply
    const common = { stepDeg: STEP, count, degPerPx: DEG_PER_PX, onScroll: apply }

    const endIntro = () => {
      introActive.current = false
      root.classList.remove('is-intro')
    }

    const startIndex = startIndexRef.current
    let intro: gsap.core.Timeline | null = null
    if (startIndex == null && !introShownThisPageLoad) {
      // интро (фидбек артдира): старт с последней карточки, один прогон
      // к первой — на ней колесо и останавливается
      introShownThisPageLoad = true
      const startDeg = (count - 1) * STEP
      gsap.set(proxy, { x: degToX(startDeg, DEG_PER_PX) })
      apply(startDeg)
      // на время интро ховер карточек выключен (класс снимается по завершении)
      root.classList.add('is-intro')
      intro = createWheelIntro({ proxy, endIndex: 0, ...common })
      intro.pause()
      intro.eventCallback('onComplete', endIntro)
    } else {
      // без интро: возврат «Назад» — прежняя карточка, иначе первая
      const deg = (startIndex ?? 0) * STEP
      gsap.set(proxy, { x: degToX(deg, DEG_PER_PX) })
      apply(deg)
      introActive.current = false
    }

    // колесо появляется с паузой и мягким фейдом (фидбек: карточки не должны
    // «уже ехать» в момент попадания на экран); прогон стартует после фейда
    gsap.set(root, { autoAlpha: 0 })
    const reveal = gsap.to(root, {
      autoAlpha: 1,
      duration: 0.45,
      ease: 'power1.out',
      delay: 0.25,
      onComplete: () => {
        if (introActive.current) intro?.play()
      },
    })

    // нажатие карточки (тач и мышь): Draggable гасит :active, класс ставим сами
    const pressCard = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('[data-wheel-index]')
      card?.classList.add('is-pressed')
    }
    const releaseCards = () => {
      root.querySelectorAll('.is-pressed').forEach((el) => el.classList.remove('is-pressed'))
    }
    root.addEventListener('pointerdown', pressCard)
    window.addEventListener('pointerup', releaseCards)
    window.addEventListener('pointercancel', releaseCards)

    let introInterrupted = false
    let drag: Draggable | null = null
    drag = createWheelDrag({
      proxy,
      trigger: root,
      ...common,
      onPress: () => {
        // касание во время интро прерывает прогон (твины уже убиты фабрикой)
        if (introActive.current) {
          introInterrupted = true
          endIntro()
        } else {
          introInterrupted = false
        }
      },
      onTap: (target) => {
        if (introInterrupted) {
          // тап, прервавший интро, карточку не выбирает — только снап к ближайшей
          introInterrupted = false
          const deg = xToDeg(Number(gsap.getProperty(proxy, 'x')), DEG_PER_PX)
          tweenWheelTo(proxy, Math.round(deg / STEP), common, drag ?? undefined)
          return
        }
        const card = target.closest<HTMLElement>('[data-wheel-index]')
        if (card) onPickRef.current(Number(card.dataset.wheelIndex))
      },
    })

    return () => {
      intro?.kill()
      reveal.kill()
      drag?.kill()
      gsap.killTweensOf(proxy)
      root.removeEventListener('pointerdown', pressCard)
      window.removeEventListener('pointerup', releaseCards)
      window.removeEventListener('pointercancel', releaseCards)
    }
  }, [count])

  const step = (dir: 1 | -1) => {
    const proxy = proxyRef.current
    if (!proxy || introActive.current) return
    const deg = xToDeg(Number(gsap.getProperty(proxy, 'x')), DEG_PER_PX)
    tweenWheelTo(proxy, Math.round(deg / STEP) + dir, {
      stepDeg: STEP,
      count,
      degPerPx: DEG_PER_PX,
      onScroll: (d) => applyRef.current(d),
    })
  }

  return (
    <div ref={rootRef} className="wheel">
      {/* невидимый прокси: его x таскает Draggable, интро и стрелки твинят его же */}
      <div ref={proxyRef} className="wheel-proxy" aria-hidden />
      {Array.from({ length: count }, (_, i) => {
        const t = cardTransform(i, 0)
        return (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="wheel-card"
            data-wheel-index={i}
            style={{
              position: 'absolute',
              left: t.left,
              top: t.top,
              transformOrigin: t.transformOrigin,
            }}
          >
            {renderCard(i)}
          </div>
        )
      })}
      <div className="wheel-arrows">
        <button
          className="arrow pressable"
          aria-label="Предыдущая карточка"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(-1)}
        >
          <img src="/assets/icons/chevron-left.svg" width={73} height={73} alt="" draggable={false} />
        </button>
        <button
          className="arrow pressable"
          aria-label="Следующая карточка"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(1)}
        >
          <img src="/assets/icons/chevron-right.svg" width={73} height={73} alt="" draggable={false} />
        </button>
      </div>
    </div>
  )
}
