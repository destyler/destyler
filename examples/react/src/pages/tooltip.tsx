import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as tooltip from '@destyler/tooltip'
import '@destyler/shared-private/styles/tooltip.css'

export default function TooltipDemo() {
  const id1 = 'id1'
  const id2 = 'id2'
  const [state1, send1] = useMachine(tooltip.machine({ id: id1 }))
  const api1 = tooltip.connect(state1, send1, normalizeProps)

  const [state2, send2] = useMachine(tooltip.machine({ id: id2 }))
  const api2 = tooltip.connect(state2, send2, normalizeProps)

  return (
    <>
      <div data-testid="focus">focus</div>
      <div className="tooltip-root">
        <button
          {...api1.getTriggerProps()}
          className="tooltip-trigger"
          data-testid={`${id1}-trigger`}
        >
          Hover me
        </button>
        <div {...api1.getPositionerProps()} className="tooltip-positioner">
          <div
            {...api1.getContentProps()}
            className="tooltip-content"
            data-testid={`${id1}-tooltip`}
          >
            Tooltip 1
          </div>
        </div>
      </div>
      <div className="tooltip-root">
        <button
          {...api2.getTriggerProps()}
          className="tooltip-trigger"
          data-testid={`${id2}-trigger`}
        >
          Over me
        </button>
        <div {...api2.getPositionerProps()} className="tooltip-positioner">
          <div
            {...api2.getContentProps()}
            className="tooltip-content"
            data-testid={`${id2}-tooltip`}
          >
            Tooltip 2
          </div>
        </div>
      </div>
      <Toolbar>
        <StateVisualizer state={state1} />
      </Toolbar>
    </>
  )
}
