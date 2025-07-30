import * as popover from '@destyler/popover'
import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { popoverControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { Fragment, useId } from 'react'
import '@destyler/shared-private/styles/popover.css'

export default function PopoverPage() {
  const controls = useControls(popoverControls)
  const [state, send] = useMachine(popover.machine({ id: useId() }), {
    context: controls.context,
  })
  const api = popover.connect(state, send, normalizeProps)

  const Teleport = api.portalled ? Portal : Fragment

  return (
    <>
      <div className="popover-demo-root">
        <button
          {...api.getTriggerProps()}
          className="popover-trigger"
        >
          Click me
        </button>
        <Teleport>
          <div {...api.getPositionerProps()} className="popover-positioner">
            <div
              {...api.getContentProps()}
              className="popover-content"
            >
              <div
                {...api.getTitleProps()}
                className="popover-title"
              >
                Presenters
              </div>
              <a href="#" data-testid="focusable-link">
                Focusable Link
              </a>
              <div
                {...api.getDescriptionProps()}
                className="popover-description"
              >
                Description
              </div>
              <button className="popover-action-btn">
                Action Button
              </button>
              <button
                {...api.getCloseTriggerProps()}
                className="popover-close-btn"
              >
                x
              </button>
            </div>
          </div>
        </Teleport>
        <span data-testid="plain-text">I am just text</span>
        <button data-testid="button-after">Button :after</button>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
