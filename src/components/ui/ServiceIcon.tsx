import type { ServiceId } from '@/data/types'
import { SERVICES } from '@/data/services'

/**
 * Иконка сервиса. Два набора ассетов:
 * - mono — монохромная 64×64 (теги заставки): assets/icons/<file>.svg
 * - tile — 70×70 с подложкой #CAB8FF и бордером (палитра, слоты, чипы):
 *   assets/icons/tile/<file>.svg
 *
 * Имя файла: SERVICES[id].icon ?? id — on-prem версии переиспользуют
 * managed-иконки. Если tile-ассета ещё нет, фолбэк — монохромная иконка
 * на CSS-подложке (класс service-icon--tile-fallback); совсем без ассета —
 * пустой плейсхолдер.
 */
export function ServiceIcon({
  id,
  size = 64,
  variant = 'mono',
}: {
  id: ServiceId
  size?: number
  variant?: 'mono' | 'tile'
}) {
  const file = SERVICES[id]?.icon ?? id
  const src =
    variant === 'tile' ? `/assets/icons/tile/${file}.svg` : `/assets/icons/${file}.svg`
  return (
    <span className="service-icon" style={{ width: size, height: size }} data-service={id}>
      <img
        src={src}
        width={size}
        height={size}
        alt=""
        draggable={false}
        onError={(e) => {
          const el = e.currentTarget
          const mono = `/assets/icons/${file}.svg`
          if (variant === 'tile' && !el.src.endsWith(mono)) {
            // tile-ассета нет — монохромная иконка на CSS-подложке
            el.src = mono
            el.parentElement?.classList.add('service-icon--tile-fallback')
            return
          }
          // ассета нет совсем — пустой плейсхолдер до заливки
          el.style.display = 'none'
          el.parentElement?.classList.add('service-icon--placeholder')
        }}
      />
    </span>
  )
}
