import { normalizeProps, useMachine } from '@destyler/react'
import * as timer from '@destyler/timer'
import { useId } from 'react'
import './index.css'

export default function Timer() {
  const [state, send] = useMachine(
    timer.machine({
      id: useId(),
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 20, seconds: 1 }),
    }),
  )

  const api = timer.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="timer-container">
      <div {...api.getAreaProps()} className="timer-area">
        <div {...api.getItemProps({ type: 'days' })} className="timer-item">
          {api.formattedTime.days}
        </div>
        <div {...api.getSeparatorProps()} className="timer-separator">
          :
        </div>
        <div {...api.getItemProps({ type: 'hours' })} className="timer-item">
          {api.formattedTime.hours}
        </div>
        <div {...api.getSeparatorProps()} className="timer-separator">
          :
        </div>
        <div {...api.getItemProps({ type: 'minutes' })} className="timer-item">
          {api.formattedTime.minutes}
        </div>
        <div {...api.getSeparatorProps()} className="timer-separator">
          :
        </div>
        <div {...api.getItemProps({ type: 'seconds' })} className="timer-item">
          {api.formattedTime.seconds}
        </div>
      </div>
    </div>
  )
}
