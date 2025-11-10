import { normalizeProps, useMachine } from '@destyler/react'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as timer from '../../index'
import '../style.css'

export default function Page() {
  const [state, send] = useMachine(
    timer.machine({
      id: useId(),
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 2, seconds: 10 }),
      onComplete() {
        // eslint-disable-next-line no-console
        console.log('Timer completed')
      },
    }),
  )

  const api = timer.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main className="timer">
        <div {...api.getRootProps()}>
          <div {...api.getAreaProps()}>
            <div {...api.getItemProps({ type: 'days' })}>{api.formattedTime.days}</div>
            <div {...api.getSeparatorProps()}>:</div>
            <div {...api.getItemProps({ type: 'hours' })}>{api.formattedTime.hours}</div>
            <div {...api.getSeparatorProps()}>:</div>
            <div {...api.getItemProps({ type: 'minutes' })}>{api.formattedTime.minutes}</div>
            <div {...api.getSeparatorProps()}>:</div>
            <div {...api.getItemProps({ type: 'seconds' })}>{api.formattedTime.seconds}</div>
          </div>
        </div>

        <div {...api.getControlProps()}>
          <button {...api.getActionTriggerProps({ action: 'start' })}>START</button>
          <button {...api.getActionTriggerProps({ action: 'pause' })}>PAUSE</button>
          <button {...api.getActionTriggerProps({ action: 'resume' })}>RESUME</button>
          <button {...api.getActionTriggerProps({ action: 'reset' })}>RESET</button>
        </div>
      </main>

      <Toolbar controls={null} viz>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
