import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { tabsControls, tabsData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as tabs from '../../index'
import styles from '../style.css?inline'

type TabsMachineContext = ContextFrom<typeof tabs.machine>

@customElement('destyler-tabs')
export class TabsElement extends LitElement {
  private controls = new ControlsController(tabsControls)

  private machine = new MachineController(
    this,
    tabs.machine({
      id: 'tabs:lit',
      value: 'nils',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<TabsMachineContext>,
        subscribe: (fn: (ctx: Partial<TabsMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = tabs.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getIndicatorProps())}></div>
            <div ${spread(api.getListProps())}>
              ${tabsData.map(item => html`
                <button data-testid=${`${item.id}-tab`} ${spread(api.getTriggerProps({ value: item.id }))}>
                  ${item.label}
                </button>
              `)}
            </div>
            ${tabsData.map(item => html`
              <div data-testid=${`${item.id}-tab-panel`} ${spread(api.getContentProps({ value: item.id }))}>
                <p>${item.content}</p>
                ${item.id === 'agnes' ? html`<input placeholder="Agnes" />` : null}
              </div>
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
    'destyler-tabs': TabsElement
  }
}
