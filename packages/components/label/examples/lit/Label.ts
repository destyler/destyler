import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as label from '../../index'
import '@destyler/shared-private/lit'

@customElement('destyler-label')
export class LabelElement extends LitElement {
  private machine = new MachineController(
    this,
    label.machine({
      id: 'label:lit',
    }),
  )

  render() {
    const api = label.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <label ${spread(api.getRootProps())}>
          text
        </label>
        <destyler-toolbar>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-label': LabelElement
  }
}
