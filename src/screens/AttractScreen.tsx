import { useFlow } from '@/app/flow'
import { FACTS } from '@/data/facts'
import { STRINGS } from '@/data/strings'
import { TAG_CLOUD_ORDER, TAG_CLOUD_HASHTAG } from '@/data/services'
import { TagChip, TextChip } from '@/components/ui/TagChip'
import { Button } from '@/components/ui/Button'

/**
 * Экран 1 — заставка (attract/idle). Макет 2334:3570.
 * Тап в любом месте — старт визита. Внизу — бегущая строка тегов
 * (ряд в макете шире экрана: 11943px). Факт-блоки — статичные.
 */
export function AttractScreen() {
  const startVisit = useFlow((s) => s.startVisit)

  return (
    <section className="screen screen--attract" onPointerUp={startVisit}>
      <header className="attract__brand">Yandex Cloud · Платформа данных</header>

      <div className="attract__text">
        <h1>{STRINGS.attract.title}</h1>
        <p>{STRINGS.attract.subtitle}</p>
        <Button className="attract__cta">{STRINGS.attract.cta}</Button>
      </div>

      <div className="attract__facts">
        {FACTS.map((f) => (
          <div className="fact" key={f.value}>
            <div className="fact__value">{f.value}</div>
            <div className="fact__label">{f.label}</div>
          </div>
        ))}
      </div>

      <div className="attract__tags">
        <div className="tags-marquee">
          {/* контент продублирован: анимация -50% даёт бесшовный цикл */}
          {[0, 1].map((copy) => (
            <div className="tags-marquee__run" key={copy} aria-hidden={copy === 1}>
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
