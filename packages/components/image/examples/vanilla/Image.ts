import type { ContextFrom } from '@destyler/vanilla'
import type { State as ImageState, MachineState } from '../../src/types'
import { imagesData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as avatar from '../../index'
import '../style.css'

const images = imagesData.full
const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

type ImageMachineContext = ContextFrom<typeof avatar.machine>

class ImageExample extends Component<avatar.Context, avatar.Api, ImageMachineContext, MachineState> {
  private readonly rootNode: HTMLElement | null
  private readonly fallbackEl: HTMLElement | null
  private readonly imgEl: HTMLImageElement | null
  private readonly imgPlaceholder: Comment = document.createComment('image-placeholder')
  private readonly changeBtn: HTMLButtonElement | null
  private readonly brokenBtn: HTMLButtonElement | null
  private readonly toggleBtn: HTMLButtonElement | null
  private readonly stateListeners = new Set<(state: ImageState) => void>()

  private src = images[0]
  private show = true

  constructor(rootEl: HTMLElement, context: avatar.Context, options?: any) {
    super(rootEl, context, options)
    this.rootNode = rootEl.querySelector('[data-image-root]')
    this.fallbackEl = rootEl.querySelector('[data-image-fallback]')
    this.imgEl = rootEl.querySelector<HTMLImageElement>('[data-image-img]')
    this.changeBtn = rootEl.querySelector('[data-image-change]')
    this.brokenBtn = rootEl.querySelector('[data-image-broken]')
    this.toggleBtn = rootEl.querySelector('[data-image-toggle]')

    this.changeBtn?.addEventListener('click', () => {
      this.setImageSource(getRandomImage())
    })

    this.brokenBtn?.addEventListener('click', () => {
      this.setImageSource(imagesData.broken)
    })

    this.toggleBtn?.addEventListener('click', () => {
      this.show = !this.show
      this.applyImageVisibility()
    })

    // ensure initial image source is reflected in DOM
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
    this.stateListeners.forEach(listener => listener(state))
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
          <button type="button" data-image-toggle>Toggle Image</button>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-image-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  layout.root.appendChild(toolbar.root)

  const instance = new ImageExample(scope, { id: 'image:vanilla' })
  instance.init()

  const updateVisualizer = (state?: ImageState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as ImageState)
  instance.onStateChange(updateVisualizer)
}
