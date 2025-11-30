<script setup lang="ts">
import CheckboxExample from '@component/checkbox/snippets/Checkbox.vue'
import CollapseExample from '@component/collapse/snippets/Collapse.vue'
import ColorPickerExample from '@component/color-picker/snippets/ColorPicker.vue'
import ComboboxExample from '@component/combobox/snippets/Combobox.vue'
import DialogExample from '@component/dialog/snippets/Dialog.vue'
import FloatingPanelExample from '@component/floating-panel/snippets/FloatingPanel.vue'
import HoverCardExample from '@component/hover-card/snippets/HoverCard.vue'
import ImageExample from '@component/image/snippets/Image.vue'
import DropdownExample from '@component/menu/snippets/menu/Menu.vue'
import NumberInputExample from '@component/number-input/snippets/NumberInput.vue'
import PaginationExample from '@component/pagination/snippets/Pagination.vue'
import PopoverExample from '@component/popover/snippets/Popover.vue'
import ProgressExample from '@component/progress/snippets/Progress.vue'
import RadioExample from '@component/radio/snippets/Radio.vue'
import SelectExample from '@component/select/snippets/Select.vue'
import SliderExample from '@component/slider/snippets/Slider.vue'
import StepsExample from '@component/steps/snippets/Steps.vue'
import SwitchExample from '@component/switch/snippets/Switch.vue'
import TabsExample from '@component/tabs/snippets/Tabs.vue'
import TimerExample from '@component/timer/snippets/Timer.vue'
import TreeExample from '@component/tree/snippets/Tree.vue'
import { onMounted, ref } from 'vue'

const refs = ref<any[]>([])

onMounted(() => {
  setTimeout(() => {
    refs.value.forEach((element) => {
      if (!element) {
        return
      }

      element.style.animationFillMode = 'forwards'
      element.style.transformOrigin = 'center'
      element.style.animationDuration = '1s'
    })
  }, 101)
})

const show = ref<boolean>(false)

onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 100)
})
</script>

<template>
  <div v-if="show" class="mt-0! py-24 sm:py-32 hidden lg:block pt-12! bg-gradient-to-b from-background/900 to-background/950">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col mt-0!">
      <div class="flex flex-col lg:grid gap-8 relative lg:grid-cols-10 lg:gap-8 overflow-hidden p-px mt-0!">
        <div :ref="(el) => (refs[1] = el)" data-layout="sinppets" class="mt-0! col-span-8 flex items-center homeDemoAnimateTop p-10px">
          <SliderExample class="min-w-full!" />
        </div>

        <div :ref="(el) => (refs[2] = el)" data-layout="sinppets" class="mt-0! col-span-2 row-span-2 flex items-center homeDemoAnimateRight">
          <RadioExample />
        </div>

        <div :ref="(el) => (refs[4] = el)" data-layout="sinppets" class="col-span-1 homeDemoAnimateLeft z-10 mt-0!">
          <DropdownExample />
        </div>

        <div
          :ref="(el) => (refs[3] = el)"
          data-layout="sinppets"
          class="col-span-7 flex flex-wrap mt-0! items-center justify-between gap-1 homeDemoAnimateBottom"
        >
          <ImageExample />
          <HoverCardExample />
          <FloatingPanelExample />
          <SwitchExample />
          <PaginationExample />
        </div>

        <div :ref="(el) => (refs[5] = el)" data-layout="sinppets" class="mt-0! col-span-3 row-span-8 gap-6 flex flex-col justify-between homeDemoAnimateLeft">
          <div class="flex justify-between items-center mt-0!" data-layout="sinppets">
            <TimerExample />
            <ColorPickerExample />
          </div>
          <div class="flex justify-between items-center mt-0!" data-layout="sinppets">
            <DialogExample />
            <PopoverExample />
          </div>
          <TabsExample />
        </div>

        <div :ref="(el) => (refs[6] = el)" data-layout="sinppets" class="col-span-5 row-span-2 flex flex-col mt-0! homeDemoAnimateBottom">
          <ProgressExample />
          <CollapseExample />
        </div>

        <div :ref="(el) => (refs[7] = el)" data-layout="sinppets" class="col-span-2 row-span-2 gap-6 flex flex-col homeDemoAnimateRight z-10 mt-0!">
          <CheckboxExample />
          <ComboboxExample />
          <SelectExample />
          <NumberInputExample />
        </div>

        <div :ref="(el) => (refs[8] = el)" class="mt-0! col-span-7 row-span-6 flex items-start justify-between gap-4 homeDemoAnimateBottom">
          <div class="shrink-0" data-layout="sinppets">
            <TreeExample />
          </div>
          <div class="flex-1">
            <StepsExample class="w-full!" data-layout="sinppets" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
