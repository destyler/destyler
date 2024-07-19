<script setup lang="ts">
import DummyPopover from './components/DummyPopover.vue'

function handleAlert() {
  window.alert('Alert')
}
</script>

<template>
  <Story
    group="private"
    title="DismissableLayer/PopoverNested"
    :layout="{ type: 'grid', width: '50%' }"
  >
    <Variant title="Dialog (fully modal example)">
      <div>
        <div class="flex flex-col gap-4 mt-12">
          <DummyPopover disable-outside-pointer-events>
            <DummyPopover
              color="tomato"
              open-label="Open red"
              close-label="Close red"
            >
              <DummyPopover
                color="royalblue"
                open-label="Open blue"
                close-label="Close blue"
                disable-outside-pointer-events
              />
            </DummyPopover>
          </DummyPopover>

          <input type="text" value="some input">
          <button @click="handleAlert">
            Alert me
          </button>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
  - [x] dismissing a `Popover` by pressing escape should only dismiss that given `Popover`, not its parents
  - [x] interacting outside the blue `Popover` should only dismiss itself and not its parents
  - [x] interacting outside the red `Popover` should dismiss itself and the black one
  - [x] unless the click wasn't outside the black one
  - [x] when the blue `Popover` is open, there should be{' '} *NO* text cursor above the red or black inputs
  - [x] when the red `Popover` is open, there should be a text cursor above the black input but not the one on the page behind
</docs>
