import { normalizeProps, useMachine } from '@destyler/react'
import * as tooltip from '@destyler/tooltip'
import { useId } from 'react'

export default function TooltipDemo() {
  const id = useId()
  const [state, send] = useMachine(tooltip.machine({ id }))
  const api = tooltip.connect(state, send, normalizeProps)

  return (
    <>
      <div className="">
        <button
          {...api.getTriggerProps()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Hover me
        </button>
        <div {...api.getPositionerProps()} className="z-50">
          <div
            {...api.getContentProps()}
            className="px-3 py-2 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 text-sm transition-opacity duration-200"
          >
            Tooltip
          </div>
        </div>
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
