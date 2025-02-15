import { sliderControls } from '@destyler/shared'
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function SliderPage() {
  const controls = useControls(sliderControls)
  const id = createUniqueId()

  const [state, send] = useMachine(slider.machine({
    id,
    value: [12],
  }), {
    context: controls.context,
  })

  const api = createMemo(() => slider.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="max-w-md mx-auto p-6">
        <div class="mb-4 flex justify-between items-center">
          <label {...api().getLabelProps()} class="text-gray-700 font-medium">
            Slider Value
          </label>
          <output {...api().getValueTextProps()} class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {api().value[0]}
          </output>
        </div>
        <div {...api().getControlProps()} class="relative py-4">
          <div
            {...api().getTrackProps()}
            class="w-full h-2 bg-gray-200 rounded-full"
          >
            <div
              {...api().getRangeProps()}
              class="h-2 bg-gray-600 rounded-full"
            />
          </div>
          <For each={api().value}>
            {(_, index) => (
              <div
                {...api().getThumbProps({ index: index() })}
                class="absolute top-2.5 w-5 h-5 bg-white border-2 border-gray-600 rounded-full cursor-pointer transform -translate-y-1/2 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <input {...api().getHiddenInputProps({ index: index() })} />
              </div>
            )}
          </For>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
