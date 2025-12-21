<script lang="ts">
import { scrollAreaControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
import { normalizeProps, useMachine } from '@destyler/svelte'
import * as scrollArea from '../../index'
import '../style.css'

const ITEM_COUNT = 1000
const ITEM_SIZE = 50

const controls = useControls(scrollAreaControls)

const [snapshot, send] = useMachine(
  scrollArea.machine({
    id: 'scroll-area:svelte',
    virtual: {
      count: ITEM_COUNT,
      itemSize: ITEM_SIZE,
      overscan: 5,
    },
  }),
  { context: controls.context },
)

const api = $derived(scrollArea.connect(snapshot, send, normalizeProps))

function scrollToRandomIndex() {
  const randomIndex = Math.floor(Math.random() * ITEM_COUNT)
  api.scrollToIndex(randomIndex, { align: 'center' })
}
</script>

<Layout>
  <main class="scroll-area-demo">
    <div class="scroll-area-controls">
      <button type="button" onclick={scrollToRandomIndex}>
        Scroll to Random
      </button>
      <button type="button" onclick={() => api.scrollToIndex(0)}>
        Scroll to Top
      </button>
      <button type="button" onclick={() => api.scrollToIndex(ITEM_COUNT - 1)}>
        Scroll to Bottom
      </button>
    </div>

    <div {...api.getRootProps()}>
      <div {...api.getViewportProps()}>
        <div {...api.getContentProps()}>
          {#each api.getVirtualItems() as item (item.index)}
            <div
              class="virtual-item"
              style="position: absolute; top: 0; left: 0; width: 100%; height: {item.size}px; transform: translateY({item.start}px);"
            >
              <div class="virtual-item-index">
                {item.index + 1}
              </div>
              <div class="virtual-item-content">
                <div class="virtual-item-title">
                  Item {item.index + 1}
                </div>
                <div class="virtual-item-description">
                  This is a virtual item with index {item.index}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div {...api.getScrollbarProps({ orientation: 'vertical' })}>
        <div {...api.getThumbProps({ orientation: 'vertical' })} />
      </div>

      <div {...api.getScrollbarProps({ orientation: 'horizontal' })}>
        <div {...api.getThumbProps({ orientation: 'horizontal' })} />
      </div>

      <div {...api.getCornerProps()} />
    </div>

    <div class="scroll-area-info">
      <div>Visible Range: {api.getVisibleRange().startIndex} - {api.getVisibleRange().endIndex}</div>
      <div>Total Size: {api.getTotalSize()}px</div>
      <div>Scroll Position: {api.scrollTop.toFixed(0)}px</div>
    </div>
  </main>

  <Toolbar>
    <StateVisualizer state={snapshot} />
    {#snippet controls_slot()}
      <Controls control={controls} />
    {/snippet}
  </Toolbar>
</Layout>
