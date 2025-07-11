import type { FC } from 'react'
import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/react'
import { progressControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'

const Progress: FC = () => {
  const controls = useControls(progressControls)

  const [state, send] = useMachine(progress.machine({
    id: useId(),
    value: 25,
    max: 100,
    min: 0,
  }), {
    context: controls.context,
  })

  const [indeterminateState, indeterminateSend] = useMachine(progress.machine({
    id: useId(),
    value: null,
    max: 100,
    min: 0,
  }))

  const api = progress.connect(state, send, normalizeProps)
  const indeterminateApi = progress.connect(indeterminateState, indeterminateSend, normalizeProps)

  return (
    <>
      <div>
        {/* Regular progress */}
        <div {...api.getRootProps()} style={{ width: '300px' }}>
          <div {...api.getLabelProps()}>Progress Label</div>
          <div {...api.getTrackProps()} style={{ height: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
            <div {...api.getRangeProps()} style={{ height: '100%', background: '#007acc', borderRadius: '5px' }} />
          </div>
          <div {...api.getValueTextProps()}>{api.valueAsString}</div>
        </div>

        {/* Indeterminate progress */}
        <div
          {...indeterminateApi.getTrackProps()}
          data-testid="indeterminate-progress"
          style={{ height: '10px', background: '#f0f0f0', borderRadius: '5px', marginTop: '20px' }}
        >
          <div {...indeterminateApi.getRangeProps()} style={{ height: '100%', background: '#007acc', borderRadius: '5px' }} />
        </div>

        {/* Control buttons */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => api.setValue(50)} data-testid="set-value">Set to 50</button>
          <button onClick={() => api.setToMax()} data-testid="set-max">Set to Max</button>
          <button onClick={() => api.setToMin()} data-testid="set-min">Set to Min</button>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Progress
