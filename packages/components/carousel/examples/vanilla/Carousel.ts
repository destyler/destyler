import type { ContextFrom } from '@destyler/vanilla'
import type { State as CarouselState } from '../../index'
import { carouselControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as carousel from '../../index'
import '../style.css'

type CarouselMachineContext = ContextFrom<typeof carousel.machine>

const images = [
  'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

class CarouselExample extends Component<
  carousel.Context,
  carousel.Api,
  CarouselMachineContext,
  carousel.MachineState
> {
  private readonly rootNode: HTMLElement
  private readonly itemGroupEl: HTMLElement
  private readonly itemEls: HTMLElement[]
  private readonly controlEl: HTMLElement
  private readonly prevButton: HTMLButtonElement
  private readonly nextButton: HTMLButtonElement
  private readonly indicatorGroup: HTMLElement
  private readonly autoplayButton: HTMLButtonElement
  private readonly scrollButton: HTMLButtonElement
  private indicatorButtons: HTMLButtonElement[] = []
  private readonly stateListeners = new Set<(state: CarouselState) => void>()
  private didRefresh = false

  constructor(rootEl: HTMLElement, context: carousel.Context, options?: any) {
    super(rootEl, context, options)
    this.rootNode = rootEl.querySelector('[data-carousel-root]') as HTMLElement
    this.itemGroupEl = rootEl.querySelector('[data-carousel-item-group]') as HTMLElement
    this.itemEls = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-carousel-item]'))
    this.controlEl = rootEl.querySelector('[data-carousel-control]') as HTMLElement
    this.prevButton = rootEl.querySelector('[data-carousel-prev]') as HTMLButtonElement
    this.nextButton = rootEl.querySelector('[data-carousel-next]') as HTMLButtonElement
    this.indicatorGroup = rootEl.querySelector('[data-carousel-indicator-group]') as HTMLElement
    this.autoplayButton = rootEl.querySelector('[data-carousel-autoplay]') as HTMLButtonElement
    this.scrollButton = rootEl.querySelector('[data-carousel-scroll]') as HTMLButtonElement
  }

  initService(context: carousel.Context) {
    return carousel.machine(context) as carousel.Service
  }

  initApi() {
    return carousel.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(fn: (state: CarouselState) => void) {
    this.stateListeners.add(fn)
  }

  protected override onTransition(state: CarouselState) {
    this.stateListeners.forEach(listener => listener(state))
    if (!this.didRefresh) {
      this.didRefresh = true
      this.service.send({ type: 'SNAP.REFRESH', src: 'vanilla.transition' } as any)
    }
  }

  render = () => {
    const api = this.api
    spreadProps(this.rootNode, api.getRootProps())
    spreadProps(this.itemGroupEl, api.getItemGroupProps())
    this.itemEls.forEach((item, index) => {
      spreadProps(item, api.getItemProps({ index }))
    })
    spreadProps(this.controlEl, api.getControlProps())
    spreadProps(this.prevButton, api.getPrevTriggerProps())
    spreadProps(this.nextButton, api.getNextTriggerProps())
    this.renderIndicators(api.pageSnapPoints.length, api)
    spreadProps(this.autoplayButton, {
      ...api.getAutoplayTriggerProps(),
      textContent: api.isPlaying ? 'Stop' : 'Play',
    })
    spreadProps(this.scrollButton, {
      onClick: () => api.scrollToIndex(1),
    })

    if (!this.didRefresh) {
      this.didRefresh = true
      queueMicrotask(() => {
        this.api.refresh()
      })
    }
  }

  private renderIndicators(count: number, api: carousel.Api) {
    if (this.indicatorButtons.length !== count) {
      this.indicatorGroup.innerHTML = ''
      this.indicatorButtons = Array.from({ length: count }).map((_, index) => {
        const btn = document.createElement('button')
        btn.id = `carousel:vanilla:indicator:${index}`
        this.indicatorGroup.appendChild(btn)
        return btn
      })
    }

    spreadProps(this.indicatorGroup, api.getIndicatorGroupProps())
    this.indicatorButtons.forEach((btn, index) => {
      spreadProps(btn, api.getIndicatorProps({ index }))
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(carouselControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  const itemsMarkup = images
    .map((src, index) => `
      <div class="carousel-item" data-carousel-item data-index="${index}">
        <img src="${src}" alt="">
      </div>
    `)
    .join('')

  layout.main.innerHTML = `
    <div class="carousel-root" data-carousel-root>
      <div class="carousel-item-group" data-carousel-item-group>
        ${itemsMarkup}
      </div>
      <div class="carousel-controls" data-carousel-control>
        <button data-carousel-prev>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
        </button>
        <div class="carousel-indicators" data-carousel-indicator-group></div>
        <button data-carousel-next>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
        </button>
      </div>
    </div>
    <div class="carousel-spacer">
      <button class="button" data-carousel-scroll>
        Scroll to 1
      </button>
      <button class="button" data-carousel-autoplay>
        Toggle Autoplay
      </button>
    </div>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-carousel-root]')?.parentElement
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new CarouselExample(scope, {
    id: 'carousel:vanilla',
    slideCount: images.length,
    slidesPerPage: 1,
    spacing: '20px',
    autoplay: false,
  }, {
    context: {
      get: () => controls.context as Partial<CarouselMachineContext>,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })

  instance.init()

  const updateVisualizer = (state?: CarouselState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as CarouselState)
  instance.onStateChange(updateVisualizer)
}
