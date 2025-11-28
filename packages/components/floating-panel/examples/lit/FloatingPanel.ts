import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { floatingPanelControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as floatingPanel from '../../index'
import styles from '../style.css?inline'

type FloatingPanelMachineContext = ContextFrom<typeof floatingPanel.machine>

@customElement('destyler-floating-panel')
export class FloatingPanelElement extends LitElement {
  private controls = new ControlsController(floatingPanelControls)

  private machine = new MachineController(
    this,
    floatingPanel.machine({ id: 'floating-panel:lit' }),
    {
      context: {
        get: () => this.controls.context as Partial<FloatingPanelMachineContext>,
        subscribe: (fn: (ctx: Partial<FloatingPanelMachineContext>) => void) =>
          this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = floatingPanel.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="floating-panel">
          <div>
            <button type="button" ${spread(api.getTriggerProps())}>Toggle Panel</button>
            <div ${spread(api.getPositionerProps())}>
              <div ${spread(api.getContentProps())}>
                <div ${spread(api.getDragTriggerProps())}>
                  <div ${spread(api.getHeaderProps())}>
                    <p ${spread(api.getTitleProps())}>Floating Panel</p>
                    <div data-scope="floating-panel" data-part="trigger-group">
                      <button type="button" ${spread(api.getMinimizeTriggerProps())}>_</button>
                      <button type="button" ${spread(api.getMaximizeTriggerProps())}>+</button>
                      <button type="button" ${spread(api.getRestoreTriggerProps())}>&#9633;</button>
                      <button type="button" ${spread(api.getCloseTriggerProps())}>x</button>
                    </div>
                  </div>
                </div>
                <div ${spread(api.getBodyProps())}>
                  <p>Some content</p>
                </div>

                <div ${spread(api.getResizeTriggerProps({ axis: 'n' }))}></div>
                <div ${spread(api.getResizeTriggerProps({ axis: 'e' }))}></div>
                <div ${spread(api.getResizeTriggerProps({ axis: 'w' }))}></div>
                <div ${spread(api.getResizeTriggerProps({ axis: 's' }))}></div>
                <div ${spread(api.getResizeTriggerProps({ axis: 'ne' }))}></div>
                <div ${spread(api.getResizeTriggerProps({ axis: 'se' }))}></div>
                <div ${spread(api.getResizeTriggerProps({ axis: 'sw' }))}></div>
                <div ${spread(api.getResizeTriggerProps({ axis: 'nw' }))}></div>
              </div>
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
    'destyler-floating-panel': FloatingPanelElement
  }
}
