import type { GameMode, Outcome, ServiceId } from '@/data/types'
import { PALETTE_ORDER } from '@/data/services'

/**
 * Контракт данных для пост-анализа — по таблице из ТЗ («Технические особенности»).
 * Одна строка = одна попытка (подтверждённый ответ или таймаут).
 * Договорённость с заказчиком: единая таблица, выгрузка в Excel, без визуализаций.
 */
export interface AttemptRow {
  /** UUID визита — генерируется по тапу «Начать», группирует попытки одного игрока. */
  session_id: string
  /** Сквозной счётчик визитов на киоске (вторичный ключ склейки со сканером лидов). */
  visit_seq: number
  /** Момент старта визита, ISO 8601 с таймзоной и мс — якорь склейки. */
  session_start_ts: string
  /** Метка этой попытки/ответа. */
  event_ts: string
  mode: GameMode
  task_id: string
  task_title: string
  outcome: Outcome
  /** 0/1 — начислена ли монета. */
  earned_coin: 0 | 1
  /** Сколько решал: от входа в задачу до ответа, сек. */
  duration_sec: number
  /** Выбранный бандл (только ready), напр. «A». */
  bundle_choice: string | null
  /** Какие бандлы открывал (только ready), напр. «A,C». */
  viewed_bundles: string | null
  /** ans_<svc>: сервис вошёл в подтверждённый ответ; tap_<svc>: сколько раз рассматривал. */
  [serviceColumn: `ans_${string}` | `tap_${string}`]: number | string | null
}

export interface AttemptInput {
  mode: GameMode
  taskId: string
  taskTitle: string
  outcome: Outcome
  earnedCoin: boolean
  durationSec: number
  /** Подтверждённый набор сервисов (слоты или состав выбранного бандла). */
  answerServices: ServiceId[]
  /** Счётчик тапов-рассматриваний по сервисам за попытку. */
  serviceTaps: Partial<Record<ServiceId, number>>
  bundleChoice?: string
  viewedBundles?: string[]
}

export function buildAttemptRow(
  visit: { sessionId: string; visitSeq: number; sessionStartTs: string },
  input: AttemptInput,
): AttemptRow {
  const row: AttemptRow = {
    session_id: visit.sessionId,
    visit_seq: visit.visitSeq,
    session_start_ts: visit.sessionStartTs,
    event_ts: isoNow(),
    mode: input.mode,
    task_id: input.taskId,
    task_title: input.taskTitle,
    outcome: input.outcome,
    earned_coin: input.earnedCoin ? 1 : 0,
    duration_sec: input.durationSec,
    bundle_choice: input.bundleChoice ?? null,
    viewed_bundles: input.viewedBundles?.join(',') ?? null,
  }
  for (const id of PALETTE_ORDER) {
    row[`ans_${id}`] = input.answerServices.includes(id) ? 1 : 0
    row[`tap_${id}`] = input.serviceTaps[id] ?? 0
  }
  return row
}

/** ISO 8601 с локальной таймзоной и миллисекундами, напр. 2026-09-24T12:34:56.789+03:00 */
export function isoNow(date = new Date()): string {
  const tzMin = -date.getTimezoneOffset()
  const sign = tzMin >= 0 ? '+' : '-'
  const pad = (n: number, w = 2) => String(Math.abs(n)).padStart(w, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}` +
    `${sign}${pad(Math.floor(Math.abs(tzMin) / 60))}:${pad(Math.abs(tzMin) % 60)}`
  )
}
