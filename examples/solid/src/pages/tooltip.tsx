import { normalizeProps, useMachine } from '@destyler/solid'
import * as tooltip from '@destyler/tooltip'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'

export default function TooltipDemo() {
  const id = createUniqueId()
  const [state, send] = useMachine(tooltip.machine({ id }))
  const api = createMemo(() => tooltip.connect(state, send, normalizeProps))

  return (
    <>
      <div class="">
        <button
          {...api().getTriggerProps()}
          class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Hover me
        </button>
        <div {...api().getPositionerProps()} class="z-50">
          <div
            {...api().getContentProps()}
            class="px-3 py-2 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 text-sm transition-opacity duration-200"
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
