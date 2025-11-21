import type { ContextFrom } from '@destyler/vanilla'
import { signatureControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as signaturePad from '../../index'
import '../style.css'

type SignatureMachineContext = ContextFrom<typeof signaturePad.machine>
type SignatureService = ReturnType<typeof signaturePad.machine>
type SignatureState = ReturnType<SignatureService['getState']>

class SignatureExample extends Component<signaturePad.Context, signaturePad.Api, SignatureMachineContext> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-signature-root]')
  private readonly labelEl = this.rootEl.querySelector<HTMLLabelElement>('[data-signature-label]')
  private readonly controlEl = this.rootEl.querySelector<HTMLElement>('[data-signature-control]')
  private readonly segmentEl = this.rootEl.querySelector<SVGSVGElement>('[data-signature-segment]')
  private readonly guideEl = this.rootEl.querySelector<HTMLElement>('[data-signature-guide]')
  private readonly clearButton = this.rootEl.querySelector<HTMLButtonElement>('[data-signature-clear]')
  private readonly showImageButton = this.rootEl.querySelector<HTMLButtonElement>('[data-signature-show]')
  private readonly previewImg = this.rootEl.querySelector<HTMLImageElement>('[data-signature-preview]')

  private previewUrl = ''

  private readonly stateListeners = new Set<(state: SignatureState) => void>()

  constructor(rootEl: HTMLElement, context: signaturePad.Context, options?: any) {
    super(rootEl, context, options)

    this.showImageButton?.addEventListener('click', () => {
      this.api?.getDataUrl('image/png').then(url => this.setPreview(url))
    })

    if (this.previewImg)
      this.previewImg.hidden = true
  }

  initService(context: signaturePad.Context) {
    return signaturePad.machine({
      ...context,
      onDrawEnd: (details) => {
        details.getDataUrl('image/png').then(url => this.setPreview(url))
      },
    }) as signaturePad.Service
  }

  initApi() {
    return signaturePad.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: SignatureState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: SignatureState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private setPreview(url: string) {
    this.previewUrl = url
    if (!this.previewImg)
      return
    this.previewImg.hidden = url.length === 0
    if (url.length === 0) {
      this.previewImg.removeAttribute('src')
    }
    else {
      this.previewImg.src = url
    }
  }

  private renderPaths(api: signaturePad.Api) {
    if (!this.segmentEl)
      return

    this.segmentEl.innerHTML = ''

    const appendPath = (path: string) => {
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      // spreadProps expects an HTMLElement, but works with SVGElement as well.
      spreadProps(pathEl as unknown as HTMLElement, api.getSegmentPathProps({ path }))
      this.segmentEl!.appendChild(pathEl)
    }

    api.paths.forEach(appendPath)
    if (api.currentPath)
      appendPath(api.currentPath)
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())
    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())
    if (this.controlEl)
      spreadProps(this.controlEl, api.getControlProps())
    if (this.segmentEl) {
      spreadProps(this.segmentEl as unknown as HTMLElement, api.getSegmentProps())
      this.renderPaths(api)
    }
    if (this.guideEl)
      spreadProps(this.guideEl, api.getGuideProps())
    if (this.clearButton)
      spreadProps(this.clearButton, api.getClearTriggerProps())

    if (this.previewImg && this.previewUrl.length > 0)
      this.previewImg.src = this.previewUrl
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(signatureControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main>
      <div data-signature-example>
        <div data-signature-root>
          <label data-signature-label>Signature Pad</label>
          <div data-signature-control>
            <svg data-signature-segment></svg>
            <div data-signature-guide></div>
          </div>
          <button type="button" data-signature-clear>x</button>
        </div>
        <button type="button" data-signature-show>Show Image</button>
        <img data-signature-preview data-part="preview" alt="signature" hidden />
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-signature-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const contextSource = {
    get: () => controls.context as Partial<SignatureMachineContext>,
    subscribe: (fn: (ctx: Partial<SignatureMachineContext>) => void) => controls.subscribe(fn as any),
  }

  const instance = new SignatureExample(
    scope,
    {
      id: 'signature:vanilla',
      drawing: {
        fill: 'red',
        size: 4,
        simulatePressure: true,
      },
    },
    { context: contextSource },
  )

  instance.init()

  const updateVisualizer = (state?: SignatureState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() =>
      StateVisualizer({ state, omit: ['currentPoints', 'currentPath', 'paths'] }),
    )
  }

  updateVisualizer(instance.state as SignatureState)
  instance.onStateChange(updateVisualizer)
}
