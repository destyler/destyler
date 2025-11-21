import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, portal, spread } from '@destyler/lit'
import { popoverControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as popover from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type PopoverMachineContext = ContextFrom<typeof popover.machine>

@customElement('destyler-popover')
export class PopoverElement extends LitElement {
  private controls = new ControlsController(popoverControls)

  private machine = new MachineController(
    this,
    popover.machine({
      id: 'popover:lit',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<PopoverMachineContext>,
        subscribe: (fn: (ctx: Partial<PopoverMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = popover.connect(this.machine.state, this.machine.send, normalizeProps)

    const content = html`
      <div ${spread(api.getPositionerProps())}>
        <div class="popover-content" data-testid="popover-content" ${spread(api.getContentProps())}>
          <div ${spread(api.getArrowProps())}>
            <div ${spread(api.getArrowTipProps())}></div>
          </div>
          <div data-testid="popover-title" ${spread(api.getTitleProps())}>
            Popover Title
          </div>
          <div data-part="body" data-testid="popover-body">
            <a>Non-focusable Link</a>
            <a href="#" data-testid="focusable-link">Focusable Link</a>
            <input data-testid="input" placeholder="input" />
            <button data-testid="popover-close-button" ${spread(api.getCloseTriggerProps())}>X</button>
          </div>
        </div>
      </div>
    `

    return html`
      <destyler-layout>
        <main class="popover">
          <div data-part="root">
            <button data-testid="button-before">Button :before</button>
            <button data-testid="popover-trigger" ${spread(api.getTriggerProps())}>
              Click me
              <div ${spread(api.getIndicatorProps())}>&gt;</div>
            </button>
            <div ${spread(api.getAnchorProps())}>anchor</div>
            ${api.portalled ? portal(content, document.body) : content}
            <span data-testid="plain-text">I am just text</span>
            <button data-testid="button-after">Button :after</button>
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
    'destyler-popover': PopoverElement
  }
}
