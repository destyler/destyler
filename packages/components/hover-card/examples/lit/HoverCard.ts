import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { hoverCardControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as hoverCard from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type HoverCardMachineContext = ContextFrom<typeof hoverCard.machine>

@customElement('destyler-hover-card')
export class HoverCardElement extends LitElement {
  private controls = new ControlsController(hoverCardControls)

  private machine = new MachineController(
    this,
    hoverCard.machine({
      id: 'hover-card:lit',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<HoverCardMachineContext>,
        subscribe: (fn: (ctx: Partial<HoverCardMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = hoverCard.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div style="display: flex; gap: 50px;">
            <a
              href="https://twitter.com/elonehoo"
              target="_blank"
              rel="noreferrer"
              ${spread(api.getTriggerProps())}
            >
              Twitter
            </a>
            ${api.open
              ? html`
                  <div ${spread(api.getPositionerProps())}>
                    <div ${spread(api.getContentProps())}>
                      <div ${spread(api.getArrowProps())}>
                        <div ${spread(api.getArrowTipProps())}></div>
                      </div>
                      Twitter Preview
                      <a href="https://twitter.com/elonehoo" target="_blank" rel="noreferrer">
                        Twitter
                      </a>
                    </div>
                  </div>
                `
              : null}
            <div data-part="test-text">Test text</div>
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
    'destyler-hover-card': HoverCardElement
  }
}
