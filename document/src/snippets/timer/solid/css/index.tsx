/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as timer from '@destyler/timer'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Timer() {
  const [state, send] = useMachine(
    timer.machine({
      id: createUniqueId(),
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 20, seconds: 1 }),
    }),
  )

  const api = createMemo(() => timer.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="timer-container">
      <div {...api().getAreaProps()} class="timer-area">
        <div {...api().getItemProps({ type: 'days' })} class="timer-item">
          {api().formattedTime.days}
        </div>
        <div {...api().getSeparatorProps()} class="timer-separator">
          :
        </div>
        <div {...api().getItemProps({ type: 'hours' })} class="timer-item">
          {api().formattedTime.hours}
        </div>
        <div {...api().getSeparatorProps()} class="timer-separator">
          :
        </div>
        <div {...api().getItemProps({ type: 'minutes' })} class="timer-item">
          {api().formattedTime.minutes}
        </div>
        <div {...api().getSeparatorProps()} class="timer-separator">
          :
        </div>
        <div {...api().getItemProps({ type: 'seconds' })} class="timer-item">
          {api().formattedTime.seconds}
        </div>
      </div>
    </div>
  )
}
