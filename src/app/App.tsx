import { useEffect } from 'react'
import { useFlow } from './flow'
import { APP_MODE, DESIGN_H, DESIGN_W } from './config'
import { useStageScale } from '@/lib/useStageScale'
import { useIdleReset } from '@/lib/useIdleReset'
import { useScreenTransition } from '@/lib/useScreenTransition'
import { AttractScreen } from '@/screens/AttractScreen'
import { ModeScreen } from '@/screens/ModeScreen'
import { TaskSelectScreen } from '@/screens/TaskSelectScreen'
import { BuildScreen } from '@/screens/BuildScreen'
import { ReadyScreen } from '@/screens/ReadyScreen'
import { IdlePrompt } from '@/screens/IdlePrompt'
import { GridOverlay } from '@/components/dev/GridOverlay'

/**
 * Корень приложения: Stage (масштабирование дизайн-сцены 3840×2160 под вьюпорт),
 * конечный автомат экранов и киоск-ограждения (автосброс, запрет жестов браузера).
 */
export default function App() {
  const screen = useFlow((s) => s.screen)
  const resetToAttract = useFlow((s) => s.resetToAttract)
  const scale = useStageScale()
  // плавная смена: сначала гаснет текущий экран, потом маунтится следующий
  const { displayed, hostRef } = useScreenTransition(screen)

  // автосброс по бездействию — только в киоске и не на заставке
  const idle = useIdleReset(APP_MODE === 'kiosk' && screen !== 'attract', resetToAttract)

  // киоск-ограждения: контекстное меню и случайные жесты браузера
  useEffect(() => {
    if (APP_MODE !== 'kiosk') return
    const prevent = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', prevent)
    document.addEventListener('gesturestart', prevent) // pinch в Safari
    document.addEventListener('dblclick', prevent)
    return () => {
      document.removeEventListener('contextmenu', prevent)
      document.removeEventListener('gesturestart', prevent)
      document.removeEventListener('dblclick', prevent)
    }
  }, [])

  return (
    <div className="viewport">
      <div
        className="stage"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          marginLeft: -DESIGN_W / 2,
          marginTop: -DESIGN_H / 2,
          transform: `scale(${scale})`,
        }}
      >
        <div className="screen-host" ref={hostRef}>
          {displayed === 'attract' && <AttractScreen />}
          {displayed === 'mode' && <ModeScreen />}
          {displayed === 'taskSelect' && <TaskSelectScreen />}
          {displayed === 'build' && <BuildScreen />}
          {displayed === 'ready' && <ReadyScreen />}
        </div>

        {idle.showPrompt && <IdlePrompt onStay={idle.stay} />}

        <GridOverlay />
      </div>
    </div>
  )
}
