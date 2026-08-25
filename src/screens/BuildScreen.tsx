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
import { useAssemble } from '@/lib/useAssemble'
import { ResultOverlay } from './ResultOverlay'

/** Коннектор между слотами — стрелка из макета (238×28). */
function SlotConnector() {
  return (
    <img
      className="slot-connector"
      src="/assets/icons/ui/arrow.svg"
      width={238}
      height={28}
      alt=""
      draggable={false}
    />
  )
}

/**
 * Экран 4 — решение задачи drag-and-drop (ветка А). Макет 11:2060 + стейты.
 *
 * Взаимодействия (по ТЗ и стейтам макета):
 * - тап по сервису → плитка выбрана, слоты подсвечены, внизу панель описания;
 * - постановка: перетаскивание в слот ЛИБО тап по свободному слоту после выбора;
 * - тап по заполненному слоту → сервис возвращается в палитру;
 * - использованный сервис в палитре гаснет;
 * - «Проверить связку» активна, когда все слоты заполнены;
 * - последние 10 секунд — красный таймер.
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
  const root = useAssemble<HTMLElement>()

  // --- drag-слой (pointer-based, работает и с тачем, и с мышью) ---
  const [ghost, setGhost] = useState<{ id: ServiceId; x: number; y: number } | null>(null)
  const dragRef = useRef<{ id: ServiceId; startX: number; startY: number; moved: boolean } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  if (!task) return null

  const canCheck = slots.every((s) => s !== null)
  const targeting = selected !== null || ghost !== null
  // в панели описания — сервис, который тянем, иначе выбранный тапом
  const infoId = ghost?.id ?? selected

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
      tapService(d.id) // тап = выбор + описание в панели
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
      ref={(el) => {
        sectionRef.current = el
        root.current = el
      }}
      className="screen screen--build"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Button
        variant="secondary"
        className="nav-back"
        onClick={() => deferNav(backToTasks)}
        data-assemble="static"
      >
        {STRINGS.build.back}
      </Button>
      <TimerBadge label={timer.label} left={timer.left} warning={timer.warning} />

      <header className="task__top" data-assemble>
        <h1>{task.title}</h1>
        <p>{task.cardDesc}</p>
      </header>

      <div className="build__panel" data-assemble>
        <div className="build__assignment">
          <h2>{STRINGS.build.assignmentLabel}</h2>
          <p>{task.assignment}</p>
        </div>

        <div className={`build__slots ${targeting ? 'is-targeting' : ''}`}>
          {slots.map((id, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <SlotConnector />}
              <div
                className={`slot ${id ? 'is-filled pressable' : ''}`}
                data-slot={i}
                onClick={() => onSlotTap(i)}
              >
                {id ? (
                  <>
                    <ServiceIcon id={id} size={70} variant="tile" />
                    <span className="slot__name">{SERVICES[id].name}</span>
                  </>
                ) : (
                  <>
                    {/* пунктир — SVG-рамка, dash 16 как в настройках макета */}
                    <svg className="slot__dash" viewBox="0 0 648 300" aria-hidden>
                      <rect x="2" y="2" width="644" height="296" rx="36" />
                    </svg>
                    <span className="slot__num">{STRINGS.build.slot(i + 1)}</span>
                    <span className="slot__plus">
                      <img src="/assets/icons/ui/plus.svg" width={64} height={64} alt="" draggable={false} />
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {infoId ? (
          <div className="svc-info">
            <ServiceIcon id={infoId} size={70} variant="tile" />
            <span>
              <b>{SERVICES[infoId].name}</b>
              <em>{SERVICES[infoId].short}</em>
            </span>
          </div>
        ) : (
          <div className="build__info">
            <span className="build__info-hand">
              <img src="/assets/icons/ui/hand.svg" width={48} height={48} alt="" draggable={false} />
            </span>
            <span className="build__info-text">{STRINGS.build.paletteHint}</span>
          </div>
        )}

        <div className={`build__palette ${selected ? 'has-selection' : ''}`}>
          {/* тапы и драг палитры обрабатываются pointer-логикой секции,
              onTap плитке не передаём — иначе тап сработает дважды */}
          {PALETTE_ORDER.map((id) => (
            <div key={id} onPointerDown={onPalettePointerDown(id)}>
              <ServiceTile
                id={id}
                used={slots.includes(id)}
                selected={selected === id}
                dragging={ghost?.id === id}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="screen__cta" data-assemble="static">
        <Button variant="secondary" onClick={clearSlots}>
          {STRINGS.build.clear}
        </Button>
        <Button disabled={!canCheck} onClick={submitBuild}>
          {STRINGS.build.check}
        </Button>
      </div>

      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x, top: ghost.y }}>
          <ServiceIcon id={ghost.id} size={70} variant="tile" />
          <span>{SERVICES[ghost.id].name}</span>
        </div>
      )}

      {result && <ResultOverlay />}
    </section>
  )
}
