import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { toggleControls, toggleData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as toggle from '../../index'
import styles from '../style.css?inline'

type ToggleMachineContext = ContextFrom<typeof toggle.machine>

@customElement('destyler-toggle-group')
export class ToggleElement extends LitElement {
  private controls = new ControlsController(toggleControls)

  private machine = new MachineController(
    this,
    toggle.machine({ id: 'toggle:lit' }),
    {
      context: {
        get: () => this.controls.context as Partial<ToggleMachineContext>,
        subscribe: (fn: (ctx: Partial<ToggleMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = toggle.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="toggle-group">
          <button>Outside</button>
          <div ${spread(api.getRootProps())}>
            ${toggleData.map(item => html`
              <button ${spread(api.getItemProps({ value: item.value }))}>
                ${item.label}
              </button>
            `)}
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
    'destyler-toggle-group': ToggleElement
  }
}
