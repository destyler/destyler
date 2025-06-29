import * as progress from '@destyler/progress'
import { progressControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'

export default function ProgressDemo() {
  const controls = useControls(progressControls)

  const [state, send] = useMachine(
    progress.machine({
      id: createUniqueId(),
      value: 30,
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => progress.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="max-w-md p-6">
        <div {...api().getLabelProps()} class="text-lg font-semibold mb-2 text-gray-800">
          Upload progress
        </div>
        <div
          {...api().getTrackProps()}
          class="w-full h-4 bg-gray-200 rounded-full overflow-hidden"
        >
          <div
            {...api().getRangeProps()}
            class="h-full bg-black transition-all duration-300 ease-out rounded-full"
          />
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
