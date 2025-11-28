import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { qrCodeControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as qrCode from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type QrCodeMachineContext = ContextFrom<typeof qrCode.machine>

@customElement('destyler-qr-code')
export class QRCodeElement extends LitElement {
  private controls = new ControlsController(qrCodeControls)

  private machine = new MachineController(
    this,
    qrCode.machine({
      id: 'qr-code:lit',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<QrCodeMachineContext>,
        subscribe: (fn: (ctx: Partial<QrCodeMachineContext>) => void) =>
          this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = qrCode.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div ${spread(api.getRootProps())}>
            <svg ${spread(api.getFrameProps())}>
              <path ${spread(api.getPatternProps())}></path>
            </svg>
            <div ${spread(api.getOverlayProps())}>
              <img src="https://avatars.githubusercontent.com/u/143371546?s=88&v=4" alt="" />
            </div>
          </div>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state} .omit=${['encoded']}>
          </destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-qr-code': QRCodeElement
  }
}
