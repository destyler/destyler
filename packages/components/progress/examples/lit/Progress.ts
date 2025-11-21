import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { progressControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as progress from '../../index'
import styles from '../style.css?inline'

type ProgressMachineContext = ContextFrom<typeof progress.machine>

@customElement('destyler-progress')
export class ProgressElement extends LitElement {
  private controls = new ControlsController(progressControls)

  private machine = new MachineController(
    this,
    progress.machine({ id: 'progress:lit' }),
    {
      context: {
        get: () => this.controls.context as Partial<ProgressMachineContext>,
        subscribe: (fn: (ctx: Partial<ProgressMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = progress.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getLabelProps())}>Upload progress</div>

            <svg ${spread(api.getCircleProps())}>
              <circle ${spread(api.getCircleTrackProps())}></circle>
              <circle ${spread(api.getCircleRangeProps())}></circle>
            </svg>

            <div ${spread(api.getTrackProps())}>
              <div ${spread(api.getRangeProps())}></div>
            </div>

            <div ${spread(api.getValueTextProps())}>${api.valueAsString}</div>

            <div class="progress__actions">
              <button type="button" @click=${() => api.setValue((api.value ?? 0) - 20)}>Decrease</button>
              <button type="button" @click=${() => api.setValue((api.value ?? 0) + 20)}>Increase</button>
              <button type="button" @click=${() => api.setValue(null)}>Indeterminate</button>
            </div>
          </div>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-progress': ProgressElement
  }
}
