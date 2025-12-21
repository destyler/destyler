import type { ContextFrom } from '@destyler/vanilla'
import type { State as ScrollAreaState } from '../../src/types'
import { scrollAreaControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as scrollArea from '../../index'
import '../style.css'

type ScrollAreaMachineContext = ContextFrom<typeof scrollArea.machine>
type ScrollAreaService = ReturnType<typeof scrollArea.machine>
type ScrollAreaSnapshot = Parameters<typeof scrollArea.connect>[0]

const ITEM_COUNT = 1000
const ITEM_SIZE = 50

class ScrollAreaExample extends Component<scrollArea.Context, scrollArea.Api, ScrollAreaMachineContext> {
  private readonly rootEl_: HTMLElement | null
  private readonly viewportEl: HTMLElement | null
  private readonly contentEl: HTMLElement | null
  private readonly scrollbarYEl: HTMLElement | null
  private readonly thumbYEl: HTMLElement | null
  private readonly scrollbarXEl: HTMLElement | null
  private readonly thumbXEl: HTMLElement | null
  private readonly cornerEl: HTMLElement | null
  private readonly infoEl: HTMLElement | null

  private readonly stateListeners = new Set<(state: ScrollAreaState) => void>()

  constructor(rootEl: HTMLElement, context: scrollArea.Context, options?: any) {
    super(rootEl, context, options)

    this.rootEl_ = rootEl.querySelector('[data-scroll-area-root]')
    this.viewportEl = rootEl.querySelector('[data-scroll-area-viewport]')
    this.contentEl = rootEl.querySelector('[data-scroll-area-content]')
    this.scrollbarYEl = rootEl.querySelector('[data-scroll-area-scrollbar-y]')
    this.thumbYEl = rootEl.querySelector('[data-scroll-area-thumb-y]')
    this.scrollbarXEl = rootEl.querySelector('[data-scroll-area-scrollbar-x]')
    this.thumbXEl = rootEl.querySelector('[data-scroll-area-thumb-x]')
    this.cornerEl = rootEl.querySelector('[data-scroll-area-corner]')
    this.infoEl = rootEl.querySelector('[data-scroll-area-info]')

    // Bind button events
    const randomBtn = rootEl.querySelector('[data-scroll-random]')
    const topBtn = rootEl.querySelector('[data-scroll-top]')
    const bottomBtn = rootEl.querySelector('[data-scroll-bottom]')

    randomBtn?.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * ITEM_COUNT)
      this.api.scrollToIndex(randomIndex, { align: 'center' })
    })

    topBtn?.addEventListener('click', () => {
      this.api.scrollToIndex(0)
    })

    bottomBtn?.addEventListener('click', () => {
      this.api.scrollToIndex(ITEM_COUNT - 1)
    })
  }

  initService(context: scrollArea.Context) {
    return scrollArea.machine(context) as ScrollAreaService
  }

  initApi() {
    return scrollArea.connect(this.service.state as ScrollAreaSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: ScrollAreaState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: ScrollAreaState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.rootEl_)
      spreadProps(this.rootEl_, api.getRootProps())

    if (this.viewportEl)
      spreadProps(this.viewportEl, api.getViewportProps())

    if (this.contentEl) {
      spreadProps(this.contentEl, api.getContentProps())
      this.renderVirtualItems(api)
    }

    if (this.scrollbarYEl)
      spreadProps(this.scrollbarYEl, api.getScrollbarProps({ orientation: 'vertical' }))

    if (this.thumbYEl)
      spreadProps(this.thumbYEl, api.getThumbProps({ orientation: 'vertical' }))

    if (this.scrollbarXEl)
      spreadProps(this.scrollbarXEl, api.getScrollbarProps({ orientation: 'horizontal' }))

    if (this.thumbXEl)
      spreadProps(this.thumbXEl, api.getThumbProps({ orientation: 'horizontal' }))

    if (this.cornerEl)
      spreadProps(this.cornerEl, api.getCornerProps())

    if (this.infoEl) {
      const range = api.getVisibleRange()
      this.infoEl.innerHTML = `
        <div>Visible Range: ${range.startIndex} - ${range.endIndex}</div>
        <div>Total Size: ${api.getTotalSize()}px</div>
        <div>Scroll Position: ${api.scrollTop.toFixed(0)}px</div>
      `
    }
  }

  private renderVirtualItems(api: scrollArea.Api) {
    if (!this.contentEl)
      return

    const items = api.getVirtualItems()
    const existingItems = new Map<number, HTMLElement>()

    // Collect existing items
    this.contentEl.querySelectorAll<HTMLElement>('.virtual-item').forEach((el) => {
      const index = Number(el.dataset.index)
      existingItems.set(index, el)
    })

    // Remove items no longer in view
    existingItems.forEach((el, index) => {
      if (!items.some(item => item.index === index)) {
        el.remove()
      }
    })

    // Add or update items
    items.forEach((item) => {
      let el = existingItems.get(item.index)

      if (!el) {
        el = document.createElement('div')
        el.className = 'virtual-item'
        el.dataset.index = String(item.index)
        el.innerHTML = `
          <div class="virtual-item-index">${item.index + 1}</div>
          <div class="virtual-item-content">
            <div class="virtual-item-title">Item ${item.index + 1}</div>
            <div class="virtual-item-description">This is a virtual item with index ${item.index}</div>
          </div>
        `
        this.contentEl!.appendChild(el)
      }

      el.style.position = 'absolute'
      el.style.top = '0'
      el.style.left = '0'
      el.style.width = '100%'
      el.style.height = `${item.size}px`
      el.style.transform = `translateY(${item.start}px)`
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(scrollAreaControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="scroll-area-demo">
      <div data-scroll-area-example>
        <div class="scroll-area-controls">
          <button type="button" data-scroll-random>Scroll to Random</button>
          <button type="button" data-scroll-top>Scroll to Top</button>
          <button type="button" data-scroll-bottom>Scroll to Bottom</button>
        </div>

        <div data-scroll-area-root>
          <div data-scroll-area-viewport>
            <div data-scroll-area-content></div>
          </div>

          <div data-scroll-area-scrollbar-y>
            <div data-scroll-area-thumb-y></div>
          </div>

          <div data-scroll-area-scrollbar-x>
            <div data-scroll-area-thumb-x></div>
          </div>

          <div data-scroll-area-corner></div>
        </div>

        <div class="scroll-area-info" data-scroll-area-info></div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-scroll-area-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new ScrollAreaExample(
    scope,
    {
      id: 'scroll-area:vanilla',
      virtual: {
        count: ITEM_COUNT,
        itemSize: ITEM_SIZE,
        overscan: 5,
      },
    },
    {
      context: {
        get: () => controls.context as Partial<ScrollAreaMachineContext>,
        subscribe: (fn: (ctx: Partial<ScrollAreaMachineContext>) => void) => controls.subscribe(fn as any),
      },
    },
  )

  instance.init()

  const updateVisualizer = (state?: ScrollAreaState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as ScrollAreaState)
  instance.onStateChange(updateVisualizer)

  return () => {
    instance.destroy?.()
  }
}
