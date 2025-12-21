<script setup lang="ts">
import { scrollAreaControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as scrollArea from '../../index'
import '../style.css'

const controls = useControls(scrollAreaControls)

const ITEM_COUNT = 1000
const ITEM_SIZE = 50

const [state, send] = useMachine(
  scrollArea.machine({
    id: useId(),
    virtual: {
      count: ITEM_COUNT,
      itemSize: ITEM_SIZE,
      overscan: 5,
    },
  }),
  { context: controls.context },
)

const api = computed(() => scrollArea.connect(state.value, send, normalizeProps))

function scrollToRandomIndex() {
  const randomIndex = Math.floor(Math.random() * ITEM_COUNT)
  api.value.scrollToIndex(randomIndex, { align: 'center' })
}
</script>

<template>
  <Layout>
    <main class="scroll-area-demo">
      <div class="scroll-area-controls">
        <button type="button" @click="scrollToRandomIndex">
          Scroll to Random
        </button>
        <button type="button" @click="api.scrollToIndex(0)">
          Scroll to Top
        </button>
        <button type="button" @click="api.scrollToIndex(ITEM_COUNT - 1)">
          Scroll to Bottom
        </button>
      </div>

      <div v-bind="api.getRootProps()">
        <div v-bind="api.getViewportProps()">
          <div v-bind="api.getContentProps()">
            <div
              v-for="item in api.getVirtualItems()"
              :key="item.index"
              class="virtual-item"
              :style="{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }"
            >
              <div class="virtual-item-index">
                {{ item.index + 1 }}
              </div>
              <div class="virtual-item-content">
                <div class="virtual-item-title">
                  Item {{ item.index + 1 }}
                </div>
                <div class="virtual-item-description">
                  This is a virtual item with index {{ item.index }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-bind="api.getScrollbarProps({ orientation: 'vertical' })">
          <div v-bind="api.getThumbProps({ orientation: 'vertical' })" />
        </div>

        <div v-bind="api.getScrollbarProps({ orientation: 'horizontal' })">
          <div v-bind="api.getThumbProps({ orientation: 'horizontal' })" />
        </div>

        <div v-bind="api.getCornerProps()" />
      </div>

      <div class="scroll-area-info">
        <div>Visible Range: {{ api.getVisibleRange().startIndex }} - {{ api.getVisibleRange().endIndex }}</div>
        <div>Total Size: {{ api.getTotalSize() }}px</div>
        <div>Scroll Position: {{ api.scrollTop.toFixed(0) }}px</div>
      </div>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
