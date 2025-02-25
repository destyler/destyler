import * as popover from '@destyler/popover'
import { popoverControls } from '@destyler/shared'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function PopoverPage() {
  const controls = useControls(popoverControls)

  const [state, send] = useMachine(popover.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => popover.connect(state, send, normalizeProps))

  return (
    <>
      <div class="mt-5">
        <button
          {...api().getTriggerProps()}
          class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Click me
        </button>

        <div {...api().getPositionerProps()} class="z-50">
          <div
            {...api().getContentProps()}
            class="bg-white shadow-lg rounded-lg border border-gray-200 w-64 p-4 mt-2"
          >
            <div
              {...api().getTitleProps()}
              class="text-lg font-semibold text-gray-900 mb-2"
            >
              Presenters
            </div>

            <div
              {...api().getDescriptionProps()}
              class="text-gray-600 mb-4"
            >
              Description
            </div>

            <button class="w-full mb-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Action Button
            </button>

            <button
              {...api().getCloseTriggerProps()}
              class="absolute top-5 right-3 text-gray-400 hover:text-gray-600 i-carbon:close-large"
            >
            </button>
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
