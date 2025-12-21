/** @jsxImportSource solid-js */

import { scrollAreaControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import * as scrollArea from '../../index'
import '../style.css'

const ITEM_COUNT = 1000
const ITEM_SIZE = 50

export default function Page() {
  const controls = useControls(scrollAreaControls)

  const [state, send] = useMachine(
    scrollArea.machine({
      id: createUniqueId(),
      virtual: {
        count: ITEM_COUNT,
        itemSize: ITEM_SIZE,
        overscan: 5,
      },
    }),
    { context: controls.context },
  )

  const api = createMemo(() => scrollArea.connect(state, send, normalizeProps))

  function scrollToRandomIndex() {
    const randomIndex = Math.floor(Math.random() * ITEM_COUNT)
    api().scrollToIndex(randomIndex, { align: 'center' })
  }

  return (
    <Layout>
      <main class="scroll-area-demo">
        <div class="scroll-area-controls">
          <button type="button" onClick={scrollToRandomIndex}>
            Scroll to Random
          </button>
          <button type="button" onClick={() => api().scrollToIndex(0)}>
            Scroll to Top
          </button>
          <button type="button" onClick={() => api().scrollToIndex(ITEM_COUNT - 1)}>
            Scroll to Bottom
          </button>
        </div>

        <div {...api().getRootProps()}>
          <div {...api().getViewportProps()}>
            <div {...api().getContentProps()}>
              <For each={api().getVirtualItems()}>
                {item => (
                  <div
                    class="virtual-item"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${item.size}px`,
                      transform: `translateY(${item.start}px)`,
                    }}
                  >
                    <div class="virtual-item-index">
                      {item.index + 1}
                    </div>
                    <div class="virtual-item-content">
                      <div class="virtual-item-title">
                        Item
                        {' '}
                        {item.index + 1}
                      </div>
                      <div class="virtual-item-description">
                        This is a virtual item with index
                        {' '}
                        {item.index}
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          <div {...api().getScrollbarProps({ orientation: 'vertical' })}>
            <div {...api().getThumbProps({ orientation: 'vertical' })} />
          </div>

          <div {...api().getScrollbarProps({ orientation: 'horizontal' })}>
            <div {...api().getThumbProps({ orientation: 'horizontal' })} />
          </div>

          <div {...api().getCornerProps()} />
        </div>

        <div class="scroll-area-info">
          <div>
            Visible Range:
            {' '}
            {api().getVisibleRange().startIndex}
            {' '}
            -
            {' '}
            {api().getVisibleRange().endIndex}
          </div>
          <div>
            Total Size:
            {' '}
            {api().getTotalSize()}
            px
          </div>
          <div>
            Scroll Position:
            {' '}
            {api().scrollTop.toFixed(0)}
            px
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
