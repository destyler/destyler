import type { ContextFrom } from '@destyler/vanilla'
import type { State as ImageState, MachineState, StatusChangeDetails } from '../../src/types'
import { imagesData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as avatar from '../../index'
import '../style.css'

const images = imagesData.full
const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

/** 1×1 PNG — deterministic load path for browser tests (no network). */
export const TEST_OK_SRC
  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

/** Invalid image payload — deterministic error path for browser tests. */
export const TEST_BAD_SRC = 'data:image/png;base64,not-a-valid-image'

type ImageMachineContext = ContextFrom<typeof avatar.machine>

class ImageExample extends Component<avatar.Context, avatar.Api, ImageMachineContext, MachineState> {
  private readonly rootNode: HTMLElement | null
  private readonly fallbackEl: HTMLElement | null
  private readonly imgEl: HTMLImageElement | null
  private readonly imgPlaceholder: Comment = document.createComment('image-placeholder')
  private readonly changeBtn: HTMLButtonElement | null
  private readonly brokenBtn: HTMLButtonElement | null
  private readonly toggleBtn: HTMLButtonElement | null
  private readonly okBtn: HTMLButtonElement | null
  private readonly badBtn: HTMLButtonElement | null
  private readonly statusEl: HTMLElement | null
  private readonly stateListeners = new Set<(state: ImageState) => void>()

  private src = TEST_OK_SRC
  private show = true
  private lastStatusChange = ''

  constructor(rootEl: HTMLElement, context: avatar.Context, options?: any) {
    super(rootEl, context, options)
    this.rootNode = rootEl.querySelector('[data-image-root]')
    this.fallbackEl = rootEl.querySelector('[data-image-fallback]')
    this.imgEl = rootEl.querySelector<HTMLImageElement>('[data-image-img]')
    this.changeBtn = rootEl.querySelector('[data-image-change]')
    this.brokenBtn = rootEl.querySelector('[data-image-broken]')
    this.toggleBtn = rootEl.querySelector('[data-image-toggle]')
    this.okBtn = rootEl.querySelector('[data-image-ok]')
    this.badBtn = rootEl.querySelector('[data-image-bad]')
    this.statusEl = rootEl.ownerDocument.querySelector('[data-image-status]')

    this.changeBtn?.addEventListener('click', () => {
      this.setImageSource(getRandomImage())
    })

    this.brokenBtn?.addEventListener('click', () => {
      this.setImageSource(imagesData.broken)
    })

    this.okBtn?.addEventListener('click', () => {
      this.setImageSource(TEST_OK_SRC)
    })

    this.badBtn?.addEventListener('click', () => {
      this.setImageSource(TEST_BAD_SRC)
    })

    this.toggleBtn?.addEventListener('click', () => {
      this.show = !this.show
      this.applyImageVisibility()
    })

    // ensure initial image source is reflected in DOM before machine start
    this.setImageSource(this.src)
  }

  initService(context: avatar.Context) {
    return avatar.machine(context) as avatar.Service
  }

  initApi() {
    return avatar.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: ImageState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: ImageState) {
    this.writeStatus(state)
    this.stateListeners.forEach(listener => listener(state))
  }

  recordStatusChange(details: StatusChangeDetails) {
    this.lastStatusChange = details.status
    this.writeStatus()
  }

  private writeStatus(state?: ImageState) {
    if (!this.statusEl)
      return
    const machineStatus = state?.value ?? (this.service?.state.value as string | undefined) ?? ''
    this.statusEl.dataset.machineStatus = String(machineStatus)
    this.statusEl.dataset.statusChange = this.lastStatusChange
    this.statusEl.textContent = `machine=${machineStatus};onStatusChange=${this.lastStatusChange}`
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())
    if (this.fallbackEl)
      spreadProps(this.fallbackEl, api.getFallbackProps())

    this.applyImageVisibility()

    if (this.imgEl) {
      spreadProps(this.imgEl, api.getImageProps())
    }
  }

  private setImageSource(nextSrc: string) {
    this.src = nextSrc
    if (this.imgEl)
      this.imgEl.src = nextSrc
  }

  private applyImageVisibility() {
    if (!this.rootNode || !this.imgEl)
      return

    if (this.show) {
      if (!this.imgEl.isConnected) {
        this.imgPlaceholder.replaceWith(this.imgEl)
      }
    }
    else {
      if (this.imgEl.isConnected) {
        this.imgEl.replaceWith(this.imgPlaceholder)
      }
    }
  }
}

export function render(target: HTMLElement) {
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="image">
      <div data-image-example>
        <div data-image-root>
          <span data-image-fallback>PA</span>
          <img data-image-img alt="" referrerpolicy="no-referrer" />
        </div>

        <div class="controls">
          <button type="button" data-image-change>Change Image</button>
          <button type="button" data-image-broken>Broken Image</button>
          <button type="button" data-testid="image-ok" data-image-ok>OK Image</button>
          <button type="button" data-testid="image-bad" data-image-bad>Bad Image</button>
          <button type="button" data-image-toggle>Toggle Image</button>
        </div>
        <div data-testid="image-status" data-image-status data-machine-status="" data-status-change="">machine=;onStatusChange=</div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-image-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  layout.root.appendChild(toolbar.root)

  const harness: { current: ImageExample | null } = { current: null }
  const example = new ImageExample(scope, {
    id: 'image:vanilla',
    onStatusChange(details) {
      harness.current?.recordStatusChange(details)
    },
  })
  harness.current = example
  example.init()

  const updateVisualizer = (state?: ImageState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(example.state as ImageState)
  example.onStateChange(updateVisualizer)
}
