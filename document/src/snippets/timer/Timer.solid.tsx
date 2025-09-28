/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as timer from '@destyler/timer'
import { createMemo, createUniqueId } from 'solid-js'
import '../../styles/components/timer.css'

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
    <>
      <div {...api().getRootProps()}>
        <div {...api().getAreaProps()}>
          <div {...api().getItemProps({ type: 'days' })}>
            {api().formattedTime.days}
          </div>
          <div {...api().getSeparatorProps()}>
            :
          </div>
          <div {...api().getItemProps({ type: 'hours' })}>
            {api().formattedTime.hours}
          </div>
          <div {...api().getSeparatorProps()}>
            :
          </div>
          <div {...api().getItemProps({ type: 'minutes' })}>
            {api().formattedTime.minutes}
          </div>
          <div {...api().getSeparatorProps()}>
            :
          </div>
          <div {...api().getItemProps({ type: 'seconds' })}>
            {api().formattedTime.seconds}
          </div>
        </div>
      </div>
    </>
  )
}
