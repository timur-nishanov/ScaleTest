import { STRINGS } from '@/data/strings'
import { Button } from '@/components/ui/Button'

/**
 * Попап «Вы ещё здесь?» (ТЗ: 15 с простоя → попап, ещё 15 с → сброс).
 * В секции Popup states макета его нет — открытый вопрос дизайнеру,
 * пока каркасный вид.
 */
export function IdlePrompt({ onStay }: { onStay: () => void }) {
  return (
    <div className="overlay overlay--idle">
      <div className="overlay__dim" />
      <div className="idle-modal">
        <h2>{STRINGS.idle.title}</h2>
        <Button onClick={onStay}>{STRINGS.idle.stay}</Button>
      </div>
    </div>
  )
}
