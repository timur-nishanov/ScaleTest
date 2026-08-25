/**
 * Мини-типограф: убирает висячие предлоги и союзы (неразрывный пробел после
 * коротких служебных слов) и прижимает тире к предыдущему слову.
 * Применяется к контенту один раз на уровне данных (src/data/*).
 */

const NBSP = ' '

/* короткие служебные слова, после которых строка не должна рваться */
const HANGING =
  /(^|[\s («„])(в|во|на|за|к|ко|с|со|о|об|обо|от|до|по|у|из|изо|без|под|над|при|про|для|и|а|но|не|ни|же|ли|бы|что|как|или|это|ещё|уже|его|её|их|то)([ ])/gi

export function typo(text: string): string {
  let out = text
  // после короткого служебного слова — неразрывный пробел (два прохода:
  // regex не ловит подряд идущие совпадения из-за пересечения границ)
  out = out.replace(HANGING, `$1$2${NBSP}`)
  out = out.replace(HANGING, `$1$2${NBSP}`)
  // тире не отрывается от предыдущего слова: «слово — слово»
  out = out.replace(/ —/g, `${NBSP}—`)
  return out
}

/** Рекурсивно прогоняет все строковые поля объекта/массива через typo. */
export function deepTypo<T>(value: T): T {
  if (typeof value === 'string') return typo(value) as T
  if (Array.isArray(value)) return value.map(deepTypo) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = deepTypo(v)
    return out as T
  }
  return value
}
