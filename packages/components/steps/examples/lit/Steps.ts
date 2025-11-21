import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { stepsControls, stepsData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as steps from '../../index'
import styles from '../style.css?inline'

type StepsMachineContext = ContextFrom<typeof steps.machine>

@customElement('destyler-steps')
export class StepsElement extends LitElement {
  private controls = new ControlsController(stepsControls)

  private machine = new MachineController(
    this,
    steps.machine({
      id: 'steps:lit',
      count: stepsData.length,
    }),
    {
      context: {
        get: () => this.controls.context as Partial<StepsMachineContext>,
        subscribe: (fn: (ctx: Partial<StepsMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = steps.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="steps">
          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getListProps())}>
              ${stepsData.map((step, index) => html`
                <div ${spread(api.getItemProps({ index }))}>
                  <button ${spread(api.getTriggerProps({ index }))}>
                    <div ${spread(api.getIndicatorProps({ index }))}>${index + 1}</div>
                    <span>${step.title}</span>
                  </button>
                  <div ${spread(api.getSeparatorProps({ index }))}></div>
                </div>
              `)}
            </div>

            ${stepsData.map((step, index) => html`
              <div ${spread(api.getContentProps({ index }))}>
                ${step.title} - ${step.description}
              </div>
            `)}

            <div ${spread(api.getContentProps({ index: stepsData.length }))}>
              Steps Complete - Thank you for filling out the form!
            </div>

            <div>
              <button ${spread(api.getPrevTriggerProps())}>Back</button>
              <button ${spread(api.getNextTriggerProps())}>Next</button>
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
    'destyler-steps': StepsElement
  }
}
