import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { clipboardControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as clipboard from '../../index'
import styles from '../style.css?inline'

type ClipboardMachineContext = ContextFrom<typeof clipboard.machine>

@customElement('destyler-clipboard')
export class ClipboardElement extends LitElement {
  private controls = new ControlsController(clipboardControls)

  private machine = new MachineController(
    this,
    clipboard.machine({
      id: 'clipboard:lit',
      value: 'https://destyler.org',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<ClipboardMachineContext>,
        subscribe: (fn: (ctx: Partial<ClipboardMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = clipboard.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
    <destyler-layout>
      <div ${spread(api.getRootProps())}>
        <label ${spread(api.getLabelProps())}>Copy this link</label>
        <div ${spread(api.getControlProps())}>
          <input style="width: 100%;" ${spread(api.getInputProps())} />
          <button ${spread(api.getTriggerProps())}>
            ${api.copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div ${spread(api.getIndicatorProps({ copied: true }))}>
          Copied!
        </div>
        <div ${spread(api.getIndicatorProps({ copied: false }))}>
          Copy
        </div>
      </div>
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
    'destyler-clipboard': ClipboardElement
  }
}
