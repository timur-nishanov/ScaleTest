import { SERVICES } from '@/data/services'
import type { ServiceId } from '@/data/types'
import { ServiceIcon } from './ServiceIcon'

/** Тег сервиса на заставке (пилюля: иконка 64 + полное имя). */
export function TagChip({ id }: { id: ServiceId }) {
  const s = SERVICES[id]
  return (
    <span className="tag-chip">
      <ServiceIcon id={id} size={64} />
      {s.tagName}
    </span>
  )
}

/** Текстовый тег без иконки («#Платформа данных»). */
export function TextChip({ text }: { text: string }) {
  return <span className="tag-chip tag-chip--text">{text}</span>
}
