import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { STEP, cardTransform, clampScroll, nearestIndex } from './wheelMath'

/**
 * Колесо карточек с физикой (см. docs/REFS.md):
 * 1) интро — при появлении колесо прокручивается по всем карточкам от первой
 *    до последней и возвращается к первой (реф lionsgoodnews);
 * 2) свободный драг с инерцией и снапом к ближайшей карточке (реф ponpon-mania);
 * 3) стрелки — шаг на соседнюю карточку.
 *
 * Каркас механики: цифры (жёсткость пружины, трение) будем тюнить на этапе
 * вёрстки на целевом железе.
 */
interface Props {
  count: number
  renderCard: (index: number, angle: number) => ReactNode
  /** Тап по карточке (не драг). */
  onPick: (index: number) => void
}

const FRICTION = 0.94
const SNAP_SPRING = 0.12
const INTRO_TOTAL_MS = 2600

export function WheelCarousel({ count, renderCard, onPick }: Props) {
  const [scroll, setScroll] = useState(0)
  const scrollRef = useRef(0)
  const velocity = useRef(0)
  const raf = useRef<number>(0)
  const phase = useRef<'intro' | 'free'>('intro')
  const introStart = useRef<number>(0)

  const drag = useRef<{
    active: boolean
    moved: boolean
    lastX: number
    startX: number
    pointerId: number
  } | null>(null)

  const setScrollBoth = useCallback((v: number) => {
    scrollRef.current = v
    setScroll(v)
  }, [])

  // единый rAF-цикл: интро → инерция/снап
  useEffect(() => {
    introStart.current = performance.now()
    const tick = (now: number) => {
      raf.current = requestAnimationFrame(tick)

      if (phase.current === 'intro') {
        const t = Math.min(1, (now - introStart.current) / INTRO_TOTAL_MS)
        // туда-обратно по всем карточкам одним ease-in-out
        const sweep = Math.sin(t * Math.PI) // 0 → 1 → 0
        setScrollBoth(sweep * (count - 1) * STEP)
        if (t >= 1) {
          phase.current = 'free'
          setScrollBoth(0)
        }
        return
      }

      if (drag.current?.active) return // позицию ведёт палец

      // инерция + снап
      let s = scrollRef.current + velocity.current
      velocity.current *= FRICTION
      if (Math.abs(velocity.current) < 0.02) {
        const target = nearestIndex(s, count) * STEP
        s += (target - s) * SNAP_SPRING
        if (Math.abs(target - s) < 0.01) s = target
      }
      s = clampScroll(s, count)
      if (s !== scrollRef.current) setScrollBoth(s)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [count, setScrollBoth])

  // px горизонтального движения → градусы вращения колеса
  const PX_TO_DEG = -STEP / 820 // ~ширина карточки с зазором на один шаг

  const onPointerDown = (e: React.PointerEvent) => {
    if (phase.current === 'intro') {
      // тап во время интро — досрочно в свободный режим
      phase.current = 'free'
      setScrollBoth(0)
      return
    }
    drag.current = {
      active: true,
      moved: false,
      lastX: e.clientX,
      startX: e.clientX,
      pointerId: e.pointerId,
    }
    velocity.current = 0
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d?.active || e.pointerId !== d.pointerId) return
    const dx = e.clientX - d.lastX
    d.lastX = e.clientX
    if (Math.abs(e.clientX - d.startX) > 8) d.moved = true
    const next = clampScroll(scrollRef.current + dx * PX_TO_DEG, count)
    velocity.current = dx * PX_TO_DEG
    setScrollBoth(next)
  }

  const endDrag = () => {
    if (drag.current) drag.current.active = false
  }

  const step = (dir: 1 | -1) => {
    if (phase.current === 'intro') return
    const target = nearestIndex(scrollRef.current, count) + dir
    velocity.current = 0
    setScrollBoth(clampScroll(target * STEP, count, 0))
  }

  return (
    <div
      className="wheel"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      {Array.from({ length: count }, (_, i) => {
        const t = cardTransform(i, scroll)
        // карточки дальше ~100° от центра не рендерим содержимым (экономия на 4К)
        const visible = Math.abs(t.angle) < 100
        return (
          <div
            key={i}
            className="wheel-card"
            style={{
              position: 'absolute',
              left: t.left,
              top: t.top,
              transform: t.transform,
              transformOrigin: t.transformOrigin,
              visibility: visible ? 'visible' : 'hidden',
            }}
            onPointerUp={() => {
              if (drag.current && !drag.current.moved && phase.current === 'free') {
                onPick(i)
              }
            }}
          >
            {visible ? renderCard(i, t.angle) : null}
          </div>
        )
      })}
      <div className="wheel-arrows">
        <button className="arrow" onPointerDown={(e) => e.stopPropagation()} onClick={() => step(-1)}>
          ←
        </button>
        <button className="arrow" onPointerDown={(e) => e.stopPropagation()} onClick={() => step(1)}>
          →
        </button>
      </div>
    </div>
  )
}
