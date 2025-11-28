import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { collapsibleControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as collapsible from '../../index'
import styles from '../style.css?inline'

type CollapsibleMachineContext = ContextFrom<typeof collapsible.machine>

@customElement('destyler-collapsible')
export class CollapsibleElement extends LitElement {
  private controls = new ControlsController(collapsibleControls)

  private machine = new MachineController(
    this,
    collapsible.machine({
      id: '1',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<CollapsibleMachineContext>,
        subscribe: (fn: (ctx: Partial<CollapsibleMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = collapsible.connect(this.machine.state, this.machine.send, normalizeProps)
    return html`
    <destyler-layout>
      <div ${spread(api.getRootProps())}>
        <button ${spread(api.getTriggerProps())}>
          Collapsible Trigger
        </button>
        <div ${spread(api.getContentProps())}>
          <p>
            Lorem dfd dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna sfsd. Ut enim ad minimdfd v eniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
            id est laborum.
            <a href="#">Some Link</a>
          </p>
        </div>
      </div>
      <destyler-toolbar .controls=${this.controls} accesskey="0">
        <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
      </destyler-toolbar>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-collapsible': CollapsibleElement
  }
}
