import { normalizeProps, useMachine } from '@destyler/solid'
import * as toast from '@destyler/toast'
import { createMemo, createUniqueId, For } from 'solid-js'
import { Portal } from 'solid-js/web'
import { ToastItem } from '../components/ToastItem'
import '@destyler/shared-private/styles/toast.css'

export default function Toast() {
  const [state, send] = useMachine(
    toast.group.machine({
      id: createUniqueId(),
      placement: 'bottom-end',
      overlap: true,
      removeDelay: 200,
    }),
  )

  const api = createMemo(() => toast.group.connect(state as any, send, normalizeProps))

  return (
    <>
      <button
        class="create-trigger"
        onClick={() => {
          api().create({
            title: 'Fetching data...',
            type: 'info',
          })
        }}
      >
        Notify
      </button>

      <Portal>
        <For each={api().getPlacements()}>
          {placement => (
            <div {...api().getGroupProps({ placement })}>
              <For each={api().getToastsByPlacement(placement)}>
                {toast => <ToastItem actor={toast} />}
              </For>
            </div>
          )}
        </For>
      </Portal>
    </>
  )
}
