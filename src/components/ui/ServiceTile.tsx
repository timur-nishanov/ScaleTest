import { SERVICES } from '@/data/services'
import type { ServiceId } from '@/data/types'
import { ServiceIcon } from './ServiceIcon'

interface Props {
  id: ServiceId
  used?: boolean
  selected?: boolean
  onTap?: (id: ServiceId) => void
}

/** Плитка сервиса в палитре (макет: 248×226, иконка 70 на подложке + подпись). */
export function ServiceTile({ id, used, selected, onTap }: Props) {
  const s = SERVICES[id]
  return (
    <div
      className={`service-tile pressable ${used ? 'is-used' : ''} ${selected ? 'is-selected' : ''}`}
      data-service={id}
      onClick={() => !used && onTap?.(id)}
    >
      <ServiceIcon id={id} size={70} variant="tile" />
      <div className="service-tile__name">{s.name}</div>
    </div>
  )
}
