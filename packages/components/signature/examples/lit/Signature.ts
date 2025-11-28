import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { signatureControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as signaturePad from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type SignatureMachineContext = ContextFrom<typeof signaturePad.machine>
const DRAWING_PRESET = {
  fill: 'red',
  size: 4,
  simulatePressure: true,
} as const

@customElement('destyler-signature')
export class SignatureElement extends LitElement {
  private controls = new ControlsController(signatureControls)
  private previewUrl = ''

  private machine = new MachineController(
    this,
    signaturePad.machine({
      id: 'signature:lit',
      drawing: DRAWING_PRESET,
      onDrawEnd: (details) => {
        details.getDataUrl('image/png').then(url => this.updatePreview(url))
      },
    }),
    {
      context: {
        get: () => this.mergeContext(this.controls.context),
        subscribe: (fn: (ctx: Partial<SignatureMachineContext>) => void) =>
          this.controls.subscribe(ctx => fn(this.mergeContext(ctx))),
      },
    },
  )

  private mergeContext(ctx: Partial<SignatureMachineContext>) {
    return {
      ...ctx,
      drawing: {
        ...DRAWING_PRESET,
        ...ctx?.drawing,
      },
    }
  }

  private updatePreview(url: string) {
    this.previewUrl = url
    this.requestUpdate()
  }

  private handleExport(api: signaturePad.Api) {
    api.getDataUrl('image/png').then(url => this.updatePreview(url))
  }

  render() {
    const api = signaturePad.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div ${spread(api.getRootProps())}>
            <label ${spread(api.getLabelProps())}>Signature Pad</label>

            <div ${spread(api.getControlProps())}>
              <svg ${spread(api.getSegmentProps())}>
                ${api.paths.map((path, index) => html`
                  <path data-index=${index} ${spread(api.getSegmentPathProps({ path }))}></path>
                `)}
                ${api.currentPath
                  ? html`<path ${spread(api.getSegmentPathProps({ path: api.currentPath }))}></path>`
                  : null}
              </svg>
              <div ${spread(api.getGuideProps())}></div>
            </div>

            <button type="button" ${spread(api.getClearTriggerProps())}>
              x
            </button>
          </div>

          <button type="button" @click=${() => this.handleExport(api)}>
            Show Image
          </button>

          ${this.previewUrl
            ? html`<img data-part="preview" alt="signature" src=${this.previewUrl} />`
            : null}
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer
            .state=${this.machine.state}
            .omit=${['currentPoints', 'currentPath', 'paths']}
          ></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-signature': SignatureElement
  }
}
