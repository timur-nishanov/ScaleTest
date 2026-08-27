import { SERVICES, ALL_SERVICE_IDS } from '@/data/services'
import { BUILD_TASKS } from '@/data/buildTasks'
import { READY_TASKS } from '@/data/readyTasks'

/**
 * Предзагрузка всех графических ассетов на старте приложения.
 *
 * Киоск живёт на заставке достаточно долго, чтобы прогреть кэш целиком, —
 * дальше ни одна картинка не «мигает» при первом появлении экрана:
 * браузер отдаёт её из memory cache в том же кадре, что и разметка.
 */
export function preloadAssets() {
  const urls = new Set<string>()
  const iconFile = (id: (typeof ALL_SERVICE_IDS)[number]) => SERVICES[id]?.icon ?? id

  // монохромные иконки всех сервисов (теги заставки, фолбэк tile)
  for (const id of ALL_SERVICE_IDS) urls.add(`/assets/icons/${iconFile(id)}.svg`)

  // иконки на подложке (палитры задач, слоты, чипы бандлов и попапов)
  const tileIds = new Set<string>()
  for (const t of BUILD_TASKS) {
    for (const id of [...t.palette, ...t.correct]) tileIds.add(iconFile(id))
  }
  for (const t of READY_TASKS) {
    for (const b of t.bundles) for (const id of b.services) tileIds.add(iconFile(id))
  }
  for (const f of tileIds) urls.add(`/assets/icons/tile/${f}.svg`)

  // UI-иконки (в т.ч. alarm — он же в CSS-маске таймера)
  for (const name of ['alarm', 'arrow', 'hand', 'plus']) {
    urls.add(`/assets/icons/ui/${name}.svg`)
  }
  for (const name of ['chevron-left', 'chevron-right', 'dice-5']) {
    urls.add(`/assets/icons/${name}.svg`)
  }

  // иллюстрации карточек задач (по маппингу лида)
  for (const t of [...BUILD_TASKS, ...READY_TASKS]) {
    urls.add(`/assets/illustrations/kv_${t.kv}.svg`)
  }

  // заставка, режимы, логотип
  for (const name of ['shape-main-1', 'shape-main-2', 'shape-main-3', 'mode-build', 'mode-ready']) {
    urls.add(`/assets/illustrations/${name}.svg`)
  }
  urls.add('/assets/logo/yc-logotype.svg')

  // иллюстрации попапов результата и монета баннера
  for (const name of [
    'popup-success',
    'popup-not-found',
    'popup-access-denied',
    'popup-unavailable',
    'coin-circle',
  ]) {
    urls.add(`/assets/illustrations/${name}.svg`)
  }

  for (const url of urls) {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}
