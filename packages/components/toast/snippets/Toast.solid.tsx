/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as toast from '@destyler/toast'
import { createMemo, createUniqueId, For } from 'solid-js'
import { Portal } from 'solid-js/web'
import { ToastItem } from './Item.solid'
import './style.css'

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

  function handleNotify() {
    api().create({
      title: 'What to say?',
      type: 'info',
    })
  }

  return (
    <>
      <button
        class="btn"
        onClick={handleNotify}
      >
        Notify
      </button>

      <Portal>
        <For each={api().getPlacements()}>
          {placement => (
            <div data-layout="sinppets" {...api().getGroupProps({ placement })}>
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
