import { useRef, useState } from 'react'
import { useFlow } from '@/app/flow'
import { getBuildTask } from '@/data/buildTasks'
import { PALETTE_ORDER, SERVICES } from '@/data/services'
import { STRINGS } from '@/data/strings'
import type { ServiceId } from '@/data/types'
import { Button } from '@/components/ui/Button'
import { ServiceTile } from '@/components/ui/ServiceTile'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { TimerBadge } from '@/components/ui/TimerBadge'
import { useTimer } from '@/lib/useTimer'
import { deferNav } from '@/lib/navDelay'
import { ResultOverlay } from './ResultOverlay'

/**
 * Экран 4 — решение задачи drag-and-drop (ветка А). Макет 2334:4377 + стейты.
 *
 * Взаимодействия (по ТЗ и стейтам макета):
 * - тап по сервису → подсветка + описание в панели (не ставит в слот);
 * - постановка: перетаскивание в слот ЛИБО тап по свободному слоту после выбора;
 * - тап по заполненному слоту → сервис возвращается в палитру;
 * - использованный сервис в палитре гаснет;
 * - «Проверить связку» активна, когда все слоты заполнены.
 */
export function BuildScreen() {
  const taskId = useFlow((s) => s.taskId)
  const slots = useFlow((s) => s.slots)
  const selected = useFlow((s) => s.selectedService)
  const result = useFlow((s) => s.result)
  const tapService = useFlow((s) => s.tapService)
  const placeService = useFlow((s) => s.placeService)
  const removeFromSlot = useFlow((s) => s.removeFromSlot)
  const clearSlots = useFlow((s) => s.clearSlots)
  const submitBuild = useFlow((s) => s.submitBuild)
  const timeoutTask = useFlow((s) => s.timeoutTask)
  const backToTasks = useFlow((s) => s.backToTasks)

  const task = getBuildTask(taskId ?? '')
  const timer = useTimer(!result, timeoutTask)

  // --- drag-слой (pointer-based, работает и с тачем, и с мышью) ---
  const [ghost, setGhost] = useState<{ id: ServiceId; x: number; y: number } | null>(null)
  const dragRef = useRef<{ id: ServiceId; startX: number; startY: number; moved: boolean } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  if (!task) return null

  const canCheck = slots.every((s) => s !== null)

  const toLocal = (e: React.PointerEvent) => {
    // координаты в дизайн-пикселях внутри секции (учитывая скейл Stage)
    const rect = sectionRef.current!.getBoundingClientRect()
    const scale = rect.width / 3840
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale }
  }

  const onPalettePointerDown = (id: ServiceId) => (e: React.PointerEvent) => {
    if (slots.includes(id)) return
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, moved: false }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 10) return
    d.moved = true
    const p = toLocal(e)
    setGhost({ id: d.id, x: p.x, y: p.y })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current
    dragRef.current = null
    setGhost(null)
    if (!d) return
    if (!d.moved) {
      tapService(d.id) // тап = описание + выбор
      return
    }
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const slotEl = el?.closest<HTMLElement>('[data-slot]')
    if (slotEl) placeService(d.id, Number(slotEl.dataset.slot))
  }

  const onSlotTap = (i: number) => {
    if (slots[i] !== null) removeFromSlot(i)
    else if (selected) placeService(selected, i)
  }

  return (
    <section
      ref={sectionRef}
      className="screen screen--build"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Button variant="secondary" className="nav-back" onClick={() => deferNav(backToTasks)}>
        {STRINGS.build.back}
      </Button>
      <TimerBadge label={timer.label} warning={timer.warning} />

      <header className="screen__top">
        <h1>{task.title}</h1>
        <p>{task.cardDesc}</p>
      </header>

      <div className="build__panel">
        <div className="build__assignment">
          <h2>{STRINGS.build.assignmentLabel}</h2>
          <p>{task.assignment}</p>
        </div>

        <div className="build__slots">
          {slots.map((id, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <span className="slot-arrow" aria-hidden>→</span>}
              <div
                className={`slot pressable ${id ? 'is-filled' : ''}`}
                data-slot={i}
                onClick={() => onSlotTap(i)}
              >
                <span className="slot__num">{STRINGS.build.slot(i + 1)}</span>
                {id ? (
                  <>
                    <ServiceIcon id={id} size={84} />
                    <span className="slot__name">{SERVICES[id].name}</span>
                  </>
                ) : (
                  <span className="slot__plus">＋</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="build__hint">
          {selected
            ? `${SERVICES[selected].name} — ${SERVICES[selected].short}. Перетащи в слот или коснись слота.`
            : STRINGS.build.paletteHint}
        </div>

        <div className="build__palette">
          {/* тапы и драг палитры обрабатываются pointer-логикой секции,
              onTap плитке не передаём — иначе тап сработает дважды */}
          {PALETTE_ORDER.map((id) => (
            <div key={id} onPointerDown={onPalettePointerDown(id)}>
              <ServiceTile id={id} used={slots.includes(id)} selected={selected === id} />
            </div>
          ))}
        </div>
      </div>

      <div className="screen__cta">
        <Button variant="secondary" onClick={clearSlots}>
          {STRINGS.build.clear}
        </Button>
        <Button disabled={!canCheck} onClick={submitBuild}>
          {STRINGS.build.check}
        </Button>
      </div>

      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x, top: ghost.y }}>
          <ServiceIcon id={ghost.id} size={84} />
        </div>
      )}

      {result && <ResultOverlay />}
    </section>
  )
}
