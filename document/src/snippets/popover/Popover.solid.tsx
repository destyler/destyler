/** @jsxImportSource solid-js */
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createSignal, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import '../../styles/components/popover.css'

export default function Popover() {
  const [buttonRef, setButtonRef] = createSignal<any>()

  const [state, send] = useMachine(popover.machine({
    id: createUniqueId(),
    initialFocusEl: buttonRef,
  }))

  const api = createMemo(() => popover.connect(state, send, normalizeProps))

  return (
    <div class=" mt-0!">
      <button {...api().getTriggerProps()}>
        Open popover
      </button>

      {api().open && (
        <Portal mount={document.body}>
          <div {...api().getPositionerProps()} data-layout="sinppets">
            <div {...api().getContentProps()}>
              <div {...api().getTitleProps()}>
                Presenters
              </div>

              <div {...api().getDescriptionProps()}>
                Description
              </div>

              <button ref={setButtonRef} class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2">
                Action Button
              </button>

              <button {...api().getCloseTriggerProps()} />
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
