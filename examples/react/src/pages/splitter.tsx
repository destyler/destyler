import { normalizeProps, useMachine } from '@destyler/react'
import { splitterControls } from '@destyler/shared-private-private'
import * as splitter from '@destyler/splitter'
import { useId } from 'react'
import { useControls } from '../hooks/use-controls'

export default function SplitterDemo() {
  const controls = useControls(splitterControls)

  const [state, send] = useMachine(
    splitter.machine({
      id: useId(),
      size: [
        { id: 'a', size: 50, minSize: 10 },
        { id: 'b', size: 50, minSize: 10 },
      ],
    }),
    {
      context: controls.context,
    },
  )

  const api = splitter.connect(state, send, normalizeProps)

  return (
    <>
      <div
        {...api.getRootProps()}
        className="h-[200px]! w-[60%]! border border-gray-200 rounded-lg bg-white shadow-sm"
      >
        <div
          {...api.getPanelProps({ id: 'a' })}
          className="bg-gray-50 p-6 flex items-center justify-center"
        >
          <p className="text-gray-800 font-medium text-lg">Panel A</p>
        </div>
        <div
          {...api.getResizeTriggerProps({ id: 'a:b' })}
          className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors duration-200 flex items-center justify-center"
        >
          <div className="w-[2px] h-8 bg-gray-400 rounded-full" />
        </div>
        <div
          {...api.getPanelProps({ id: 'b' })}
          className="bg-white p-6 flex items-center justify-center"
        >
          <p className="text-gray-800 font-medium text-lg">Panel B</p>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
