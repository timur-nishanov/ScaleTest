import type { ServiceId } from '@/data/types'

/**
 * Иконка сервиса. Два набора ассетов:
 * - mono — монохромная 64×64 (теги заставки): assets/icons/<id>.svg
 * - tile — 70×70 с подложкой #CAB8FF и бордером (палитра, слоты, чипы):
 *   assets/icons/tile/<id>.svg
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
  const src =
    variant === 'tile' ? `/assets/icons/tile/${id}.svg` : `/assets/icons/${id}.svg`
  return (
    <span className="service-icon" style={{ width: size, height: size }} data-service={id}>
      <img
        src={src}
        width={size}
        height={size}
        alt=""
        draggable={false}
        onError={(e) => {
          // плейсхолдер до заливки ассетов
          const el = e.currentTarget
          el.style.display = 'none'
          el.parentElement?.classList.add('service-icon--placeholder')
        }}
      />
    </span>
  )
}
