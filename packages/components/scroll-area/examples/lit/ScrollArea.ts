import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { scrollAreaControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as scrollArea from '../../index'
import styles from '../style.css?inline'
import '../style.css'

const ITEM_COUNT = 1000
const ITEM_SIZE = 50

type ScrollAreaMachineContext = ContextFrom<typeof scrollArea.machine>

@customElement('destyler-scroll-area')
export class ScrollAreaElement extends LitElement {
  private controls = new ControlsController(scrollAreaControls)

  private machine = new MachineController(
    this,
    scrollArea.machine({
      id: 'scroll-area:lit',
      virtual: {
        count: ITEM_COUNT,
        itemSize: ITEM_SIZE,
        overscan: 5,
      },
    }),
    {
      context: {
        get: () => this.controls.context as Partial<ScrollAreaMachineContext>,
        subscribe: (fn: (ctx: Partial<ScrollAreaMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  private scrollToRandomIndex() {
    const api = scrollArea.connect(this.machine.state, this.machine.send, normalizeProps)
    const randomIndex = Math.floor(Math.random() * ITEM_COUNT)
    api.scrollToIndex(randomIndex, { align: 'center' })
  }

  render() {
    const api = scrollArea.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="scroll-area-demo">
          <div class="scroll-area-controls">
            <button type="button" @click=${() => this.scrollToRandomIndex()}>
              Scroll to Random
            </button>
            <button type="button" @click=${() => api.scrollToIndex(0)}>
              Scroll to Top
            </button>
            <button type="button" @click=${() => api.scrollToIndex(ITEM_COUNT - 1)}>
              Scroll to Bottom
            </button>
          </div>

          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getViewportProps())}>
              <div ${spread(api.getContentProps())}>
                ${api.getVirtualItems().map(item => html`
                  <div
                    class="virtual-item"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: ${item.size}px; transform: translateY(${item.start}px);"
                  >
                    <div class="virtual-item-index">
                      ${item.index + 1}
                    </div>
                    <div class="virtual-item-content">
                      <div class="virtual-item-title">
                        Item ${item.index + 1}
                      </div>
                      <div class="virtual-item-description">
                        This is a virtual item with index ${item.index}
                      </div>
                    </div>
                  </div>
                `)}
              </div>
            </div>

            <div ${spread(api.getScrollbarProps({ orientation: 'vertical' }))}>
              <div ${spread(api.getThumbProps({ orientation: 'vertical' }))}></div>
            </div>

            <div ${spread(api.getScrollbarProps({ orientation: 'horizontal' }))}>
              <div ${spread(api.getThumbProps({ orientation: 'horizontal' }))}></div>
            </div>

            <div ${spread(api.getCornerProps())}></div>
          </div>

          <div class="scroll-area-info">
            <div>Visible Range: ${api.getVisibleRange().startIndex} - ${api.getVisibleRange().endIndex}</div>
            <div>Total Size: ${api.getTotalSize()}px</div>
            <div>Scroll Position: ${api.scrollTop.toFixed(0)}px</div>
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
    'destyler-scroll-area': ScrollAreaElement
  }
}
