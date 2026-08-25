import type { AttemptRow } from './events'

/**
 * Транспорт аналитики. Пока бэкенда нет — события копятся в localStorage
 * (переживают перезагрузку киоска) и логируются в консоль.
 *
 * Когда появится бэкенд (этап 4 плана): выставить VITE_ANALYTICS_URL —
 * очередь начнёт отправляться батчами с ретраями; офлайн-очередь остаётся
 * страховкой на случай проблем с сетью на стенде.
 */
const QUEUE_KEY = 'yc-bundle/attempts'
const ENDPOINT: string | undefined = import.meta.env.VITE_ANALYTICS_URL

function readQueue(): AttemptRow[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as AttemptRow[]
  } catch {
    return []
  }
}

function writeQueue(rows: AttemptRow[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(rows))
  } catch {
    // localStorage переполнен/недоступен — не роняем игру из-за аналитики
  }
}

export function submitAttempt(row: AttemptRow) {
  const queue = readQueue()
  queue.push(row)
  writeQueue(queue)
  if (import.meta.env.DEV) console.info('[analytics] attempt', row)
  void flush()
}

let flushing = false

export async function flush() {
  if (!ENDPOINT || flushing) return
  const queue = readQueue()
  if (queue.length === 0) return
  flushing = true
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempts: queue }),
    })
    if (res.ok) writeQueue([])
  } catch {
    // офлайн — очередь останется до следующего flush
  } finally {
    flushing = false
  }
}

/** Служебное: выгрузить накопленную очередь (для отладки на стенде). */
export function dumpQueue(): AttemptRow[] {
  return readQueue()
}
