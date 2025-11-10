/** @jsxImportSource solid-js */

import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as timer from '../../index'
import '../style.css'

export default function Page() {
  const [state, send] = useMachine(
    timer.machine({
      id: createUniqueId(),
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 2, seconds: 10 }),
      onComplete() {
        // eslint-disable-next-line no-console
        console.log('Timer completed')
      },
    }),
  )

  const api = createMemo(() => timer.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main class="timer">
        <div {...api().getRootProps()}>
          <div {...api().getAreaProps()}>
            <div {...api().getItemProps({ type: 'days' })}>{api().formattedTime.days}</div>
            <div {...api().getSeparatorProps()}>:</div>
            <div {...api().getItemProps({ type: 'hours' })}>{api().formattedTime.hours}</div>
            <div {...api().getSeparatorProps()}>:</div>
            <div {...api().getItemProps({ type: 'minutes' })}>{api().formattedTime.minutes}</div>
            <div {...api().getSeparatorProps()}>:</div>
            <div {...api().getItemProps({ type: 'seconds' })}>{api().formattedTime.seconds}</div>
          </div>
        </div>

        <div {...api().getControlProps()}>
          <button onClick={api().start}>START</button>
          <button onClick={api().pause}>PAUSE</button>
          <button onClick={api().resume}>RESUME</button>
          <button onClick={api().reset}>RESET</button>
        </div>
      </main>

      <Toolbar controls={null} viz>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
