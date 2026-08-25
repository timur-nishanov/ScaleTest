import { deepTypo } from '@/lib/typo'

/**
 * Факт-блоки заставки. В макете (фрейм 11:1134) три статичных блока
 * с декоративными фигурами — не ротатор, как было в раннем ТЗ.
 * Тексты подписей — с макета.
 */
export interface Fact {
  value: string
  label: string
}

export const FACTS: Fact[] = deepTypo([
  { value: '13 сервисов', label: 'в одной платформе данных' },
  { value: '0 забот', label: 'об администрировании инфраструктуры' },
  { value: '99,9%', label: 'SLA доступности managed-сервисов' },
])
