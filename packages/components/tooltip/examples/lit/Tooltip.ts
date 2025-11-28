import { MachineController, normalizeProps, portal, spread } from '@destyler/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as tooltip from '../../index'
import styles from '../style.css?inline'

@customElement('destyler-tooltip')
export class TooltipElement extends LitElement {
  private firstMachine = new MachineController(
    this,
    tooltip.machine({
      id: 'tooltip:lit:1',
    }),
  )

  private secondMachine = new MachineController(
    this,
    tooltip.machine({
      id: 'tooltip:lit:2',
    }),
  )

  render() {
    const api = tooltip.connect(this.firstMachine.state, this.firstMachine.send, normalizeProps)
    const api2 = tooltip.connect(this.secondMachine.state, this.secondMachine.send, normalizeProps)

    const inlineContent = api.open
      ? html`
          <div ${spread(api.getPositionerProps())}>
            <div class="tooltip-content" data-testid="tip-1-tooltip" ${spread(api.getContentProps())}>
              Tooltip
            </div>
          </div>
        `
      : null

    const portalledContent = api2.open
      ? portal(
          html`
            <div ${spread(api2.getPositionerProps())}>
              <div class="tooltip-content" data-testid="tip-2-tooltip" ${spread(api2.getContentProps())}>
                Tooltip 2
              </div>
            </div>
          `,
          document.body,
        )
      : null

    return html`
      <destyler-layout>
        <main class="tooltip">
          <div class="root">
            <button data-testid="tip-1-trigger" ${spread(api.getTriggerProps())}>
              Hover me
            </button>
            ${inlineContent}

            <button data-testid="tip-2-trigger" ${spread(api2.getTriggerProps())}>
              Over me
            </button>
            ${portalledContent}
          </div>
        </main>

        <destyler-toolbar>
          <destyler-state-visualizer label="Tooltip 1" .state=${this.firstMachine.state}></destyler-state-visualizer>
          <destyler-state-visualizer label="Tooltip 2" .state=${this.secondMachine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-tooltip': TooltipElement
  }
}
