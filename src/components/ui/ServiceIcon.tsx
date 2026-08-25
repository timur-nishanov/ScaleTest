import type { ServiceId } from '@/data/types'

/**
 * Иконка сервиса. Ассеты появятся в public/assets/icons/<id>.svg —
 * компонент уже смотрит туда, а до заливки показывает плейсхолдер с инициалами.
 */
export function ServiceIcon({ id, size = 64 }: { id: ServiceId; size?: number }) {
  return (
    <span
      className="service-icon"
      style={{ width: size, height: size }}
      data-service={id}
    >
      <img
        src={`/assets/icons/${id}.svg`}
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
