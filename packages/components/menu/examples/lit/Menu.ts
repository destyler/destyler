import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, portal, spread } from '@destyler/lit'
import { menuControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as menu from '../../index'
import styles from '../style.css?inline'

type MenuMachineContext = ContextFrom<typeof menu.machine>

const items = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete' },
  { value: 'export', label: 'Export...' },
] as const

@customElement('destyler-menu')
export class MenuElement extends LitElement {
  private controls = new ControlsController(menuControls)

  private machine = new MachineController(
    this,
    menu.machine({
      id: 'menu:lit',
      // eslint-disable-next-line no-console
      onSelect: console.log,
    }),
    {
      context: {
        get: () => this.controls.context as Partial<MenuMachineContext>,
        subscribe: (fn: (ctx: Partial<MenuMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = menu.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <button ${spread(api.getTriggerProps())}>
            Actions <span ${spread(api.getIndicatorProps())}>▾</span>
          </button>
          ${api.open
            ? portal(
                html`
                  <div ${spread(api.getPositionerProps())}>
                    <ul ${spread(api.getContentProps())}>
                      ${items.map(item => html`<li ${spread(api.getItemProps({ value: item.value }))}>${item.label}</li>`)}
                    </ul>
                  </div>
                `,
                document.body,
              )
            : null}
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
    'destyler-menu': MenuElement
  }
}
