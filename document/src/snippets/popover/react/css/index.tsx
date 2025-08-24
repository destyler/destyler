import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Popover() {

  const buttonRef = useRef(null)

  const [state, send] = useMachine(popover.machine({
    id: useId(),
    initialFocusEl: ()=> buttonRef.current
  }))

  const api = popover.connect(state, send, normalizeProps)

  return (
    <div className="popover-container">
      <button
        {...api.getTriggerProps()}
        className="popover-trigger"
      >
        Open popover
      </button>

      {api.open && createPortal(
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

            <div
              {...api.getDescriptionProps()}
              className="popover-description"
            >
              Description
            </div>

            <button ref={buttonRef} className="popover-action-button">
              Action Button
            </button>

            <button
              {...api.getCloseTriggerProps()}
              className="popover-close-button i-carbon:close-large"
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
