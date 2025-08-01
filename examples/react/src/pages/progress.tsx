import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/react'
import { progressControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared/src/styles/components/progress.css'

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
      <div {...api.getRootProps()} className="progress-root">
        <div {...api.getLabelProps()} className="progress-label">
          Upload progress
        </div>
        <div
          {...api.getTrackProps()}
          className="progress-track"
        >
          <div
            {...api.getRangeProps()}
            className="progress-range"
          />
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
