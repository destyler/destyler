<script setup lang="ts">
import { ref } from 'vue'

import { DismissableLayer } from '../src'
import DummyDialog from './components/DummyDialog.vue'
import DummyPopover from './components/DummyPopover.vue'

function handleAlert() {
  window.alert('Alert')
}

const open = ref(false)
</script>

<template>
  <Story
    group="private"
    title="DismissableLayer/Dialog"
    :layout="{ type: 'grid', width: '50%' }"
  >
    <Variant title="Dialog (fully modal example)">
      <div>
        <div class="flex flex-col gap-4 mt-12">
          <DummyDialog open-label="Open Dialog" close-label="Close dialog" />

          <input type="text" value="some input">
          <button @click="handleAlert">
            Alert me
          </button>
        </div>
      </div>
    </Variant>

    <Variant title="Popover (fully modal example)">
      <div>
        <div class="flex flex-col gap-4 mt-12">
          <DummyPopover
            open-label="Open Popover"
            close-label="Close Popover"
            disable-outside-pointer-events
          />

          <input type="text" value="some input">
          <button @click="handleAlert">
            Alert me
          </button>
        </div>
      </div>
    </Variant>
    <Variant title="Dialog (with scrollbar)">
      <div class="flex flex-col gap-4">
        <button
          class="py-2 rounded bg-gray-500 focus:outline focus:outline-blue-500"
          type="button"
          @click="open = !open"
        >
          Open layer
        </button>

        <template v-if="open">
          <Teleport to="body">
            <div
              class="fixed top-0 left-0 bottom-0 right-0 pointer-event-none bg-black/30 flex items-center justify-center overflow-y-auto"
            >
              <DismissableLayer @dismiss="open = false">
                <div class="h-[200vh] text-white flex items-center justify-center p-16 bg-gray-700">
                  Long content. Clicking on scrollbar shouldn't dismiss the layer
                </div>
              </DismissableLayer>
            </div>
          </Teleport>
        </template>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
  - [x] focus should move inside 「 `Dialog` / `Popover`」 when mounted
  - [x] focus should be trapped inside 「 `Dialog` / `Popover`」
  - [x] scrolling outside 「 `Dialog` / `Popover`」 should be disabled
  - [x] should be able to dismiss 「 `Dialog` / `Popover`」 on pressing escape
  - [x] focus should return to the open button
  - [x] interacting outside 「 `Dialog` / `Popover`」 should be disabled (clicking the "alert me" button shouldn't do anything)
  - ➕
    - should be able to dismiss 「 `Dialog` / `Popover`」 when interacting outside
    - focus should return to the open button
</docs>
