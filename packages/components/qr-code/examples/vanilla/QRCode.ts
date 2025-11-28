import type { ContextFrom } from '@destyler/vanilla'
import type { MachineApi, MachineState, State as QRCodeState, Service } from '../../src/types'
import { qrCodeControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as qrCode from '../../index'
import '../style.css'

type QRCodeMachineContext = ContextFrom<typeof qrCode.machine>

class QRCodeExample extends Component<qrCode.Context, MachineApi, QRCodeMachineContext, MachineState> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-qr-code-root]')
  private readonly frameEl = this.rootEl.querySelector<SVGSVGElement>('[data-qr-code-frame]')
  private readonly patternEl = this.rootEl.querySelector<SVGPathElement>('[data-qr-code-pattern]')
  private readonly overlayEl = this.rootEl.querySelector<HTMLElement>('[data-qr-code-overlay]')
  private readonly downloadTriggerEl = this.rootEl.querySelector<HTMLButtonElement>('[data-qr-code-download]')

  private readonly stateListeners = new Set<(state: QRCodeState) => void>()

  initService(context: qrCode.Context) {
    return qrCode.machine(context) as Service
  }

  initApi() {
    return qrCode.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: QRCodeState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: QRCodeState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    if (this.rootNode)
      spreadProps(this.rootNode, this.api.getRootProps())
    if (this.frameEl)
      spreadProps(this.frameEl, this.api.getFrameProps())
    if (this.patternEl)
      spreadProps(this.patternEl, this.api.getPatternProps())
    if (this.overlayEl)
      spreadProps(this.overlayEl, this.api.getOverlayProps())

    if (this.downloadTriggerEl) {
      spreadProps(this.downloadTriggerEl, {
        ...this.api.getDownloadTriggerProps({
          fileName: 'destyler-qr-code.png',
          mimeType: 'image/png',
          quality: 0.92,
        }),
        'data-testid': 'qr-code:download',
      })
      this.downloadTriggerEl.textContent = 'Download PNG'
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(qrCodeControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-qr-code-example>
      <div data-qr-code-root>
        <svg data-qr-code-frame>
          <path data-qr-code-pattern></path>
        </svg>
        <div data-qr-code-overlay>
          <img src="https://avatars.githubusercontent.com/u/143371546?s=88&v=4" alt="" />
        </div>
        <button type="button" data-qr-code-download>Download PNG</button>
      </div>
    </div>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-qr-code-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new QRCodeExample(scope, { id: 'qr-code:vanilla' }, {
    context: {
      get: () => controls.context as Partial<QRCodeMachineContext>,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })

  instance.init()

  const updateVisualizer = (state?: QRCodeState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['encoded'] }))
  }

  updateVisualizer(instance.state as QRCodeState)
  instance.onStateChange(updateVisualizer)
}
