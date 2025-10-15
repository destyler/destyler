import { normalizeProps, Portal, useMachine } from '@destyler/react'
import * as toast from '@destyler/toast'
import { useId } from 'react'
import { ToastItem } from '../components/ToastItem'
import '@destyler/shared-private/styles/toast.css'

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

  return (
    <div>
      <button
        className="create-trigger"
        onClick={() => {
          api.create({
            title: 'Fetching data...',
            type: 'info',
          })
        }}
      >
        Notify
      </button>

      <Portal>
        {api.getPlacements().map(placement => (
          <div key={placement} {...api.getGroupProps({ placement })}>
            {api.getToastsByPlacement(placement).map(toast => (
              <ToastItem key={toast.id} actor={toast} />
            ))}
          </div>
        ))}
      </Portal>
    </div>
  )
}
