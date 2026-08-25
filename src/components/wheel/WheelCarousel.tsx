import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import type { Draggable } from 'gsap/Draggable'
import { DEG_PER_PX, STEP, cardAngle, cardTransform } from './wheelMath'
import { createWheelDrag, tweenWheelTo, xToDeg } from '@/animations/wheelDrag'
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
}

export function WheelCarousel({ count, renderCard, onPick }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const proxyRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const introActive = useRef(true)
  const applyRef = useRef<(deg: number) => void>(() => {})
  const onPickRef = useRef(onPick)
  onPickRef.current = onPick

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

    gsap.set(proxy, { x: 0 })
    apply(0)

    const intro = createWheelIntro({ proxy, ...common })
    intro.eventCallback('onComplete', () => {
      introActive.current = false
    })

    let drag: Draggable | null = null
    drag = createWheelDrag({
      proxy,
      trigger: root,
      ...common,
      onTap: (target) => {
        if (introActive.current) {
          // тап во время интро только прерывает прогон и снапит к ближайшей
          introActive.current = false
          intro.kill()
          const deg = xToDeg(Number(gsap.getProperty(proxy, 'x')), DEG_PER_PX)
          tweenWheelTo(proxy, Math.round(deg / STEP), common, drag ?? undefined)
          return
        }
        const card = target.closest<HTMLElement>('[data-wheel-index]')
        if (card) onPickRef.current(Number(card.dataset.wheelIndex))
      },
    })

    return () => {
      intro.kill()
      drag?.kill()
      gsap.killTweensOf(proxy)
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
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
            <path d="M26 10 L14 22 L26 34" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="arrow pressable"
          aria-label="Следующая карточка"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(1)}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
            <path d="M18 10 L30 22 L18 34" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
