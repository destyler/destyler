import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as timer from '../../index'
import styles from '../style.css?inline'
import '@destyler/shared-private/lit'

@customElement('destyler-timer')
export class TimerElement extends LitElement {
  private machine = new MachineController(
    this,
    timer.machine({
      id: 'timer:lit',
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 2, seconds: 10 }),
      onComplete() {
        // eslint-disable-next-line no-console
        console.log('Timer completed')
      },
    }),
  )

  render() {
    const api = timer.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="timer">
          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getAreaProps())}>
              <div ${spread(api.getItemProps({ type: 'days' }))}>${api.formattedTime.days}</div>
              <div ${spread(api.getSeparatorProps())}>:</div>
              <div ${spread(api.getItemProps({ type: 'hours' }))}>${api.formattedTime.hours}</div>
              <div ${spread(api.getSeparatorProps())}>:</div>
              <div ${spread(api.getItemProps({ type: 'minutes' }))}>${api.formattedTime.minutes}</div>
              <div ${spread(api.getSeparatorProps())}>:</div>
              <div ${spread(api.getItemProps({ type: 'seconds' }))}>${api.formattedTime.seconds}</div>
            </div>
          </div>

          <div ${spread(api.getControlProps())}>
            <button ${spread(api.getActionTriggerProps({ action: 'start' }))}>START</button>
            <button ${spread(api.getActionTriggerProps({ action: 'pause' }))}>PAUSE</button>
            <button ${spread(api.getActionTriggerProps({ action: 'resume' }))}>RESUME</button>
            <button ${spread(api.getActionTriggerProps({ action: 'reset' }))}>RESET</button>
          </div>
        </main>

        <destyler-toolbar>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-timer': TimerElement
  }
}
