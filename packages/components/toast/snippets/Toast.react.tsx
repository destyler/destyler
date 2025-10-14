import { normalizeProps, Portal, useMachine } from '@destyler/react'
import * as toast from '@destyler/toast'
import { useId } from 'react'
import { ToastItem } from './Item.react'
import './style.css'

export default function Toast() {
  const [state, send] = useMachine(
    toast.group.machine({
      id: useId(),
      placement: 'bottom-end',
      overlap: true,
      removeDelay: 200,
    }),
  )

  const api = toast.group.connect(state as any, send, normalizeProps)

  function handleNotify() {
    api.create({
      title: 'What to say?',
      type: 'info',
    })
  }

  return (
    <div>
      <button
        className="btn"
        onClick={handleNotify}
      >
        Notify
      </button>

      <Portal>
        {api.getPlacements().map(placement => (
          <div data-layout="sinppets" key={placement} {...api.getGroupProps({ placement })}>
            {api.getToastsByPlacement(placement).map(toast => (
              <ToastItem key={toast.id} actor={toast} />
            ))}
          </div>
        ))}
      </Portal>
    </div>
  )
}
