import { create } from 'zustand'
import type { GameMode, Outcome, ReadyBundle, ServiceId } from '@/data/types'
import { BUILD_TASKS, getBuildTask } from '@/data/buildTasks'
import { READY_TASKS, getReadyTask } from '@/data/readyTasks'
import { FLAGS } from './config'
import { buildAttemptRow, isoNow } from '@/analytics/events'
import { submitAttempt } from '@/analytics/sink'

export type Screen = 'attract' | 'mode' | 'taskSelect' | 'build' | 'ready'

export interface ResultState {
  outcome: Outcome
  earnedCoin: boolean
  /** build: снапшот слотов на момент проверки */
  placedSnapshot?: (ServiceId | null)[]
  /** build: индексы слотов, подсвечиваемых красным («лишнее») */
  wrongSlots?: number[]
  /** эталонная связка (build) / состав лучшего бандла (ready) */
  correct: ServiceId[]
  /** ready: имя выбранного бандла */
  chosenBundle?: string
  /** ready: лучший бандл целиком (для блока «Оптимальная связка») */
  bestBundle?: ReadyBundle
}

interface Visit {
  sessionId: string
  visitSeq: number
  sessionStartTs: string
}

interface FlowState {
  screen: Screen
  gameMode: GameMode
  taskId: string | null
  visit: Visit | null
  /** performance.now() входа в задачу — для duration_sec */
  taskStartedAt: number | null
  /** build: содержимое слотов */
  slots: (ServiceId | null)[]
  /** build: выбранный тапом сервис (подсветка + панель описания) */
  selectedService: ServiceId | null
  /** счётчик «рассматриваний» сервисов за попытку (аналитика) */
  serviceTaps: Partial<Record<ServiceId, number>>
  /** ready: какие бандлы видел (в текущем макете видны все сразу) */
  viewedBundles: string[]
  /** оверлей результата поверх экрана задачи; null — игра идёт */
  result: ResultState | null
  /**
   * Позиция колеса задач при возврате «Назад» из задачи: интро не повторяем,
   * колесо стоит на выбранной карточке. null — свежий вход, играем интро
   * (сбрасывается при выходе на экран выбора режима).
   */
  taskWheelIndex: number | null

  startVisit: () => void
  chooseMode: (mode: GameMode) => void
  openTask: (taskId: string) => void
  openRandomTask: () => void
  backToMode: () => void
  backToTasks: () => void

  tapService: (id: ServiceId) => void
  placeService: (id: ServiceId, slot: number) => void
  removeFromSlot: (slot: number) => void
  clearSlots: () => void
  submitBuild: () => void

  chooseBundle: (name: string) => void

  timeoutTask: () => void
  resetToAttract: () => void
}

const VISIT_SEQ_KEY = 'yc-bundle/visit-seq'

function nextVisitSeq(): number {
  try {
    const next = Number(localStorage.getItem(VISIT_SEQ_KEY) ?? '0') + 1
    localStorage.setItem(VISIT_SEQ_KEY, String(next))
    return next
  } catch {
    return 0
  }
}

function newVisit(): Visit {
  return {
    sessionId: crypto.randomUUID(),
    visitSeq: nextVisitSeq(),
    sessionStartTs: isoNow(),
  }
}

const cleanAttempt = {
  taskId: null,
  taskStartedAt: null,
  slots: [] as (ServiceId | null)[],
  selectedService: null,
  serviceTaps: {},
  viewedBundles: [] as string[],
  result: null,
}

export const useFlow = create<FlowState>((set, get) => {
  /** Собрать и отправить строку попытки в аналитику. */
  function report(input: {
    outcome: Outcome
    earnedCoin: boolean
    answerServices: ServiceId[]
    bundleChoice?: string
  }) {
    const s = get()
    const task =
      s.gameMode === 'build' ? getBuildTask(s.taskId ?? '') : getReadyTask(s.taskId ?? '')
    if (!s.visit || !task) return
    submitAttempt(
      buildAttemptRow(
        {
          sessionId: s.visit.sessionId,
          visitSeq: s.visit.visitSeq,
          sessionStartTs: s.visit.sessionStartTs,
        },
        {
          mode: s.gameMode,
          taskId: task.id,
          taskTitle: task.title,
          outcome: input.outcome,
          earnedCoin: input.earnedCoin,
          durationSec: s.taskStartedAt
            ? Math.round((performance.now() - s.taskStartedAt) / 1000)
            : 0,
          answerServices: input.answerServices,
          serviceTaps: s.serviceTaps,
          bundleChoice: input.bundleChoice,
          viewedBundles: s.gameMode === 'ready' ? s.viewedBundles : undefined,
        },
      ),
    )
  }

  return {
    screen: 'attract',
    gameMode: 'build',
    visit: null,
    taskWheelIndex: null,
    ...cleanAttempt,

    startVisit: () =>
      set({ screen: 'mode', visit: newVisit(), taskWheelIndex: null, ...cleanAttempt }),

    chooseMode: (mode) =>
      set({ screen: 'taskSelect', gameMode: mode, taskWheelIndex: null, ...cleanAttempt }),

    openTask: (taskId) => {
      const { gameMode } = get()
      // запоминаем карточку — при возврате «Назад» колесо встанет на неё без интро
      const pool = gameMode === 'build' ? BUILD_TASKS : READY_TASKS
      const wheelIndex = pool.findIndex((t) => t.id === taskId)
      if (wheelIndex >= 0) set({ taskWheelIndex: wheelIndex })
      if (gameMode === 'build') {
        const task = getBuildTask(taskId)
        if (!task) return
        set({
          screen: 'build',
          taskId,
          taskStartedAt: performance.now(),
          slots: new Array<ServiceId | null>(task.correct.length).fill(null),
          selectedService: null,
          serviceTaps: {},
          result: null,
        })
      } else {
        const task = getReadyTask(taskId)
        if (!task) return
        set({
          screen: 'ready',
          taskId,
          taskStartedAt: performance.now(),
          // в макете все бандлы с описаниями видны сразу
          viewedBundles: task.bundles.map((b) => b.name),
          serviceTaps: {},
          result: null,
        })
      }
    },

    openRandomTask: () => {
      const { gameMode } = get()
      const pool = gameMode === 'build' ? BUILD_TASKS : READY_TASKS
      get().openTask(pool[Math.floor(Math.random() * pool.length)].id)
    },

    // после карточек «Назад» — следующий вход на колесо снова с интро
    backToMode: () => set({ screen: 'mode', taskWheelIndex: null, ...cleanAttempt }),
    // из задачи «Назад» — колесо на прежнем месте, без повторного интро
    backToTasks: () => set({ screen: 'taskSelect', ...cleanAttempt }),

    tapService: (id) =>
      set((s) => ({
        selectedService: s.selectedService === id ? null : id,
        serviceTaps: { ...s.serviceTaps, [id]: (s.serviceTaps[id] ?? 0) + 1 },
      })),

    placeService: (id, slot) =>
      set((s) => {
        if (s.slots[slot] !== null || s.slots.includes(id)) return s
        const slots = [...s.slots]
        slots[slot] = id
        return { slots, selectedService: null }
      }),

    removeFromSlot: (slot) =>
      set((s) => {
        const slots = [...s.slots]
        slots[slot] = null
        return { slots }
      }),

    clearSlots: () =>
      set((s) => ({ slots: s.slots.map(() => null), selectedService: null })),

    submitBuild: () => {
      const s = get()
      const task = getBuildTask(s.taskId ?? '')
      if (!task || s.slots.some((x) => x === null)) return
      const placed = s.slots as ServiceId[]
      const ok = FLAGS.orderMatters
        ? placed.every((id, i) => id === task.correct[i])
        : placed.length === task.correct.length &&
          placed.every((id) => task.correct.includes(id))
      const wrongSlots = placed
        .map((id, i) =>
          (FLAGS.orderMatters ? id === task.correct[i] : task.correct.includes(id))
            ? null
            : i,
        )
        .filter((x): x is number => x !== null)
      const outcome: Outcome = ok ? 'correct' : 'wrong'
      report({ outcome, earnedCoin: false, answerServices: placed })
      set({
        result: {
          outcome,
          earnedCoin: false,
          placedSnapshot: [...s.slots],
          wrongSlots,
          correct: task.correct,
        },
      })
    },

    chooseBundle: (name) => {
      const s = get()
      const task = getReadyTask(s.taskId ?? '')
      const bundle = task?.bundles.find((b) => b.name === name)
      if (!task || !bundle || s.result) return
      const best = task.bundles.find((b) => b.tier === 'best')!
      const outcome: Outcome =
        bundle.tier === 'best' ? 'correct' : bundle.tier === 'partial' ? 'partial' : 'wrong'
      const earnedCoin = bundle.tier !== 'wrong'
      report({
        outcome,
        earnedCoin,
        answerServices: bundle.services,
        bundleChoice: name,
      })
      set({
        result: {
          outcome,
          earnedCoin,
          correct: best.services,
          chosenBundle: name,
          bestBundle: best,
        },
      })
    },

    timeoutTask: () => {
      const s = get()
      if (s.result) return
      if (s.gameMode === 'build') {
        const task = getBuildTask(s.taskId ?? '')
        if (!task) return
        report({
          outcome: 'timeout',
          earnedCoin: false,
          answerServices: s.slots.filter((x): x is ServiceId => x !== null),
        })
        // по макету «Время вышло» тоже показывает «Твою сборку» (что успел поставить)
        set({
          result: {
            outcome: 'timeout',
            earnedCoin: false,
            placedSnapshot: [...s.slots],
            correct: task.correct,
          },
        })
      } else {
        const task = getReadyTask(s.taskId ?? '')
        if (!task) return
        const best = task.bundles.find((b) => b.tier === 'best')!
        // по ТЗ таймаут в режиме «готовое» монету даёт
        report({ outcome: 'timeout', earnedCoin: true, answerServices: [] })
        set({
          result: {
            outcome: 'timeout',
            earnedCoin: true,
            correct: best.services,
            bestBundle: best,
          },
        })
      }
    },

    resetToAttract: () =>
      set({ screen: 'attract', visit: null, taskWheelIndex: null, ...cleanAttempt }),
  }
})
