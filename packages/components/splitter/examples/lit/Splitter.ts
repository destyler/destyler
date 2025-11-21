import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { splitterControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as splitter from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type SplitterMachineContext = ContextFrom<typeof splitter.machine>

@customElement('destyler-splitter')
export class SplitterElement extends LitElement {
  private controls = new ControlsController(splitterControls)

  private machine = new MachineController(
    this,
    splitter.machine({
      id: 'splitter:lit',
      orientation: 'horizontal',
      size: [
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ],
    }),
    {
      context: {
        get: () => this.controls.context as Partial<SplitterMachineContext>,
        subscribe: (fn: (ctx: Partial<SplitterMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = splitter.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="splitter" style="min-width: 400px; max-width: 400px; min-height: 200px;">
          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getPanelProps({ id: 'a' }))}>
              <p>A</p>
            </div>
            <div ${spread(api.getResizeTriggerProps({ id: 'a:b' }))}>
              <div class="bar"></div>
            </div>
            <div ${spread(api.getPanelProps({ id: 'b' }))}>
              <p>B</p>
            </div>
          </div>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer
            .state=${this.machine.state}
            .omit=${['previousPanels', 'initialSize']}
          ></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-splitter': SplitterElement
  }
}
