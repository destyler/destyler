import { toggleControls } from '@destyler/shared-private-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as toggle from '@destyler/toggle'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function TogglePage() {
  const controls = useControls(toggleControls)

  const [state, send] = useMachine(toggle.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => toggle.connect(state, send, normalizeProps))

  return (
    <>
      <div class="flex">
        <div
          {...api().getRootProps()}
          class="bg-white p-2 rounded-lg shadow-md space-x-2"
        >
          {['bold', 'italic', 'underline'].map(item => (
            <button
              {...api().getItemProps({ value: item })}
              class={`w-10 h-10 rounded-md border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium ${
                api().value.includes(item) ? 'bg-gray-800 text-white hover:bg-gray-700' : ''
              }`}
            >
              {item[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
