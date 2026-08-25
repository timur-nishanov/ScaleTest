import { useEffect, useRef } from 'react'
import { useFlow } from '@/app/flow'
import { FACTS } from '@/data/facts'
import { STRINGS } from '@/data/strings'
import { TAG_CLOUD_ORDER, TAG_CLOUD_HASHTAG } from '@/data/services'
import { TagChip, TextChip } from '@/components/ui/TagChip'
import { createMarquee } from '@/animations/marquee'
import { useAssemble } from '@/lib/useAssemble'
import { deferNav } from '@/lib/navDelay'

/* Визуальное соответствие факт-блоков (порядок = FACTS): фигура + модификатор позиции. */
const FACT_VIEW = [
  { mod: 'services', shape: 'shape-main-1.svg' },
  { mod: 'care', shape: 'shape-main-2.svg' },
  { mod: 'sla', shape: 'shape-main-3.svg' },
] as const

/**
 * Экран 1 — заставка (attract/idle). Макет 11:1134, вёрстка 1:1
 * в дизайн-координатах 3840×2160 (сетка 12 колонок / margin 90 / gutter 60).
 *
 * Тап в любом месте — старт визита. Теги — бесшовная бегущая строка на GSAP
 * (медленное движение — решение артдира).
 */
export function AttractScreen() {
  const startVisit = useFlow((s) => s.startVisit)
  const trackRef = useRef<HTMLDivElement>(null)
  const root = useAssemble<HTMLElement>()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tween = createMarquee(track, { speed: 60 })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <section ref={root} className="screen screen--attract" onPointerUp={() => deferNav(startVisit)}>
      {/* Логотип YC 672×95 @ (90,90); при отсутствии файла — текстовый фолбэк */}
      <div className="attract__logo" data-assemble="static">
        <img
          src="/assets/logo/yc-logotype.svg"
          alt="Yandex Cloud"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement?.classList.add('attract__logo--placeholder')
          }}
        />
        <span className="attract__logo-fallback" aria-hidden>
          Yandex&nbsp;Cloud
        </span>
      </div>

      <div className="attract__text">
        <h1 data-assemble>{STRINGS.attract.title}</h1>
        <p data-assemble>{STRINGS.attract.subtitle}</p>
      </div>

      <button className="attract__cta pressable" data-assemble>
        {STRINGS.attract.cta}
      </button>

      {/* Факт-блоки: фигуры-ассеты + тексты из data/facts, координаты из макета */}
      {FACTS.map((f, i) => (
        <div key={f.value} className={`fact fact--${FACT_VIEW[i].mod}`} data-assemble>
          <img src={`/assets/illustrations/${FACT_VIEW[i].shape}`} alt="" draggable={false} />
          <div className="fact__value">{f.value}</div>
          <div className="fact__label">{f.label}</div>
        </div>
      ))}

      <div className="attract__tags" data-assemble>
        {/* контент продублирован: xPercent -50 даёт бесшовный цикл */}
        <div className="tags-track" ref={trackRef}>
          {[0, 1].map((copy) => (
            <div className="tags-run" key={copy} aria-hidden={copy === 1}>
              <TextChip text={TAG_CLOUD_HASHTAG} />
              {TAG_CLOUD_ORDER.map((id) => (
                <TagChip key={id} id={id} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
