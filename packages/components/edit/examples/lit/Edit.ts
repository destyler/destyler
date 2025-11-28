import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { editControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as edit from '../../index'
import styles from '../style.css?inline'

type EditMachineContext = ContextFrom<typeof edit.machine>

@customElement('destyler-edit')
export class EditElement extends LitElement {
  private controls = new ControlsController(editControls)

  private machine = new MachineController(
    this,
    edit.machine({
      id: 'edit:lit',
      value: 'Hello World',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<EditMachineContext>,
        subscribe: (fn: (ctx: Partial<EditMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = edit.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getAreaProps())}>
              <input ${spread(api.getInputProps())} />
              <span ${spread(api.getPreviewProps())}></span>
            </div>
            <div ${spread(api.getControlProps())}>
              <button ${spread(api.getEditTriggerProps())}>Edit</button>
              <button ${spread(api.getSubmitTriggerProps())}>Save</button>
              <button ${spread(api.getCancelTriggerProps())}>Cancel</button>
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
    'destyler-edit': EditElement
  }
}
