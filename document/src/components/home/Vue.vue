<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CheckboxExample from '../../snippets/checkbox/Checkbox.vue'
import CollapseExample from '../../snippets/collapse/Collapse.vue'
import ColorPickerExample from '../../snippets/color-picker/ColorPicker.vue'
import ComboboxExample from '../../snippets/combobox/Combobox.vue'
import DialogExample from '../../snippets/dialog/Dialog.vue'
import FloatingPanelExample from '../../snippets/floating-panel/FloatingPanel.vue'
import HoverCardExample from '../../snippets/hover-card/HoverCard.vue'
import ImageExample from '../../snippets/image/Image.vue'
import DropdownExample from '../../snippets/menu/Menu.vue'
import NumberInputExample from '../../snippets/number-input/NumberInput.vue'
import PaginationExample from '../../snippets/pagination/Pagination.vue'
import PopoverExample from '../../snippets/popover/Popover.vue'
import ProgressExample from '../../snippets/progress/Progress.vue'
import RadioExample from '../../snippets/radio/Radio.vue'
import SelectExample from '../../snippets/select/Select.vue'
import SliderExample from '../../snippets/slider/Slider.vue'
import StepsExample from '../../snippets/steps/Steps.vue'
import SwitchExample from '../../snippets/switch/Switch.vue'
import TabsExample from '../../snippets/tabs/Tabs.vue'
import TimerExample from '../../snippets/timer/Timer.vue'
import TreeExample from '../../snippets/tree/Tree.vue'

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
  <div v-if="show" class="mt-0! py-24 sm:py-32 hidden lg:block !pt-12 bg-gradient-to-b from-background/900 to-background/950">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col mt-0!">
      <div class="flex flex-col lg:grid gap-8 relative lg:grid-cols-10 lg:gap-8 overflow-hidden p-px mt-0!">
        <div :ref="(el) => (refs[1] = el)" class="mt-0! col-span-8 flex items-center homeDemoAnimateTop p-10px">
          <SliderExample class="min-w-full!" />
        </div>

        <div :ref="(el) => (refs[2] = el)" class="mt-0! col-span-2 row-span-2 flex items-center homeDemoAnimateRight">
          <RadioExample />
        </div>

        <div :ref="(el) => (refs[4] = el)" class="col-span-1 homeDemoAnimateLeft z-10 mt-0!">
          <DropdownExample />
        </div>

        <div
          :ref="(el) => (refs[3] = el)"
          class="col-span-7 flex flex-wrap mt-0! items-center justify-between gap-1 homeDemoAnimateBottom"
        >
          <ImageExample />
          <HoverCardExample />
          <FloatingPanelExample />
          <SwitchExample />
          <PaginationExample />
        </div>

        <div :ref="(el) => (refs[5] = el)" class="mt-0! col-span-3 row-span-8 gap-6 flex flex-col justify-between homeDemoAnimateLeft">
          <div class="flex justify-between items-center mt-0!">
            <TimerExample />
            <ColorPickerExample />
          </div>
          <div class="flex justify-between items-center mt-0!">
            <DialogExample />
            <PopoverExample />
          </div>
          <TabsExample />
        </div>

        <div :ref="(el) => (refs[6] = el)" class="col-span-5 row-span-2 flex flex-col mt-0! homeDemoAnimateBottom">
          <ProgressExample />
          <CollapseExample />
        </div>

        <div :ref="(el) => (refs[7] = el)" class="col-span-2 row-span-2 gap-6 flex flex-col homeDemoAnimateRight z-10 mt-0!">
          <CheckboxExample />
          <ComboboxExample />
          <SelectExample />
          <NumberInputExample />
        </div>

        <div :ref="(el) => (refs[8] = el)" class="mt-0! col-span-7 row-span-6 flex items-start justify-between gap-4 homeDemoAnimateBottom">
          <div class="flex-shrink-0">
            <TreeExample />
          </div>
          <div class="flex-1">
            <StepsExample class="w-full!" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
