/** @jsxImportSource solid-js */
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'

export default function Popover() {

  const [buttonRef, setButtonRef] = createSignal<any>()

  const [state, send] = useMachine(popover.machine({
    id: createUniqueId(),
    initialFocusEl: buttonRef,
  }))

  const api = createMemo(() => popover.connect(state, send, normalizeProps))

  return (
    <div class="popover-container">
      <button
        {...api().getTriggerProps()}
        class="popover-trigger"
      >
        Open popover
      </button>

      {api().open && (
        <Portal mount={document.body}>
          <div {...api().getPositionerProps()} class="popover-positioner">
            <div
              {...api().getContentProps()}
              class="popover-content"
            >
              <div
                {...api().getTitleProps()}
                class="popover-title"
              >
                Presenters
              </div>

              <div
                {...api().getDescriptionProps()}
                class="popover-description"
              >
                Description
              </div>

              <button ref={setButtonRef} class="popover-action-button">
                Action Button
              </button>

              <button
                {...api().getCloseTriggerProps()}
                class="popover-close-button i-carbon:close-large"
              />
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
