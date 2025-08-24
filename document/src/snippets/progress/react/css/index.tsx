import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

export default function Progress() {
  const [state, send] = useMachine(progress.machine({
    id: useId(),
    value: 30, 
  }))

  const api = progress.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className='progress-root'>
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
  )
}
