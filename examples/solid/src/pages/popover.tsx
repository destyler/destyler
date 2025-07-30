/** @jsxImportSource solid-js */
import * as popover from '@destyler/popover'
import { popoverControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, type ParentProps } from 'solid-js'
import { Portal } from "solid-js/web"
import '@destyler/shared-private/styles/popover.css';

function Wrapper(props: ParentProps<{ guard: boolean }>) {
  return <>{props.guard ? <Portal mount={document.body}>{props.children}</Portal> : props.children}</>
}


export default function PopoverPage() {
  const controls = useControls(popoverControls)
  const [state, send] = useMachine(popover.machine({ id: createUniqueId() }), {
    context: controls.context,
  })
  const api = createMemo(() => popover.connect(state, send, normalizeProps))

  return (
    <>
      <div class="popover-demo-root">
        <button
          {...api().getTriggerProps()}
          class="popover-trigger"
        >
          Click me
        </button>
        <Wrapper guard={api().portalled}>
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
              <a href="#" data-testid="focusable-link">
                Focusable Link
              </a>
              <div
                {...api().getDescriptionProps()}
                class="popover-description"
              >
                Description
              </div>
              <button class="popover-action-btn">
                Action Button
              </button>
              <button
                {...api().getCloseTriggerProps()}
                class="popover-close-btn"
              >
                x
              </button>
            </div>
          </div>
        </Wrapper>
        <span data-testid="plain-text">I am just text</span>
        <button data-testid="button-after">Button :after</button>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
