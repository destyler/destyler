import { splitterControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as splitter from '@destyler/splitter'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'

export default function SplitterDemo() {
  const controls = useControls(splitterControls)

  const [state, send] = useMachine(
    splitter.machine({
      id: createUniqueId(),
      size: [
        { id: 'a', size: 50, minSize: 10 },
        { id: 'b', size: 50, minSize: 10 },
      ],
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => splitter.connect(state, send, normalizeProps))

  return (
    <>
      <div
        {...api().getRootProps()}
        class="h-[200px]! w-[80%]! border border-gray-200 rounded-lg bg-white shadow-sm"
      >
        <div
          {...api().getPanelProps({ id: 'a' })}
          class="bg-gray-50 p-6 flex items-center justify-center"
        >
          <p class="text-gray-800 font-medium text-lg">Panel A</p>
        </div>
        <div
          {...api().getResizeTriggerProps({ id: 'a:b' })}
          class="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors duration-200 flex items-center justify-center"
        >
          <div class="w-[2px] h-8 bg-gray-400 rounded-full" />
        </div>
        <div
          {...api().getPanelProps({ id: 'b' })}
          class="bg-white p-6 flex items-center justify-center"
        >
          <p class="text-gray-800 font-medium text-lg">Panel B</p>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
