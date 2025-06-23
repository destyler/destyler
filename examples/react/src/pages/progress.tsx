import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/react'
import { progressControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function ProgressDemo() {
  const controls = useControls(progressControls)

  const [state, send] = useMachine(
    progress.machine({
      id: useId(),
      value: 30,
    }),
    {
      context: controls.context,
    },
  )

  const api = progress.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="max-w-md p-6">
        <div {...api.getLabelProps()} className="text-lg font-semibold mb-2 text-gray-800">
          Upload progress
        </div>
        <div
          {...api.getTrackProps()}
          className="w-full h-4 bg-gray-200 rounded-full overflow-hidden"
        >
          <div
            {...api.getRangeProps()}
            className="h-full bg-black transition-all duration-300 ease-out rounded-full"
          />
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
