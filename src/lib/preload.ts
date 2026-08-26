import { SERVICES, PALETTE_ORDER } from '@/data/services'
import { BUILD_TASKS } from '@/data/buildTasks'
import { READY_TASKS } from '@/data/readyTasks'
import type { ServiceId } from '@/data/types'

/**
 * Предзагрузка всех графических ассетов на старте приложения.
 *
 * Киоск живёт на заставке достаточно долго, чтобы прогреть кэш целиком, —
 * дальше ни одна картинка не «мигает» при первом появлении экрана:
 * браузер отдаёт её из memory cache в том же кадре, что и разметку.
 */
export function preloadAssets() {
  const urls = new Set<string>()

  // монохромные иконки сервисов (теги заставки)
  for (const id of Object.keys(SERVICES)) urls.add(`/assets/icons/${id}.svg`)

  // иконки на подложке (палитра, слоты, чипы)
  for (const id of PALETTE_ORDER) urls.add(`/assets/icons/tile/${id}.svg`)

  // UI-иконки (в т.ч. alarm — он же в CSS-маске таймера)
  for (const name of ['alarm', 'arrow', 'hand', 'plus']) {
    urls.add(`/assets/icons/ui/${name}.svg`)
  }
  for (const name of ['chevron-left', 'chevron-right', 'dice-5']) {
    urls.add(`/assets/icons/${name}.svg`)
  }

  // иллюстрации карточек задач (по ключевому сервису)
  const kvIds = new Set<ServiceId>([
    ...BUILD_TASKS.map((t) => t.kv),
    ...READY_TASKS.map((t) => t.kv),
  ])
  for (const id of kvIds) urls.add(`/assets/illustrations/kv_${id}.svg`)

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
