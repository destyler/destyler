import { normalizeProps, useMachine } from '@destyler/react'
import * as timer from '@destyler/timer'
import { useId } from 'react'
import './style.css'

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
    <>
      <div {...api.getRootProps()}>
        <div {...api.getAreaProps()}>
          <div {...api.getItemProps({ type: 'days' })}>
            {api.formattedTime.days}
          </div>
          <div {...api.getSeparatorProps()}>
            :
          </div>
          <div {...api.getItemProps({ type: 'hours' })}>
            {api.formattedTime.hours}
          </div>
          <div {...api.getSeparatorProps()}>
            :
          </div>
          <div {...api.getItemProps({ type: 'minutes' })}>
            {api.formattedTime.minutes}
          </div>
          <div {...api.getSeparatorProps()}>
            :
          </div>
          <div {...api.getItemProps({ type: 'seconds' })}>
            {api.formattedTime.seconds}
          </div>
        </div>
      </div>
    </>
  )
}
