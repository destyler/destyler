<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SliderExample from '../../../../snippets/slider/index.vue'
import RadioExample from '../../../../snippets/radio/index.vue'
import DropdownExample from '../../../../snippets/dropdown/index.vue'
import ImageExample from '../../../../snippets/images/index.vue'
import ButtonExample from '../../../../snippets/buttons/index.vue'
import PaginationExample from '../../../../snippets/pagination/index.vue'
import CheckboxExample from '../../../../snippets/checkbox/index.vue'
import SwitchExample from '../../../../snippets/switchs/index.vue'
import InfoExample from '../../../../snippets/info/index.vue'
import TabsExample from '../../../../snippets/tabs/index.vue'
import ToolbarExample from '../../../../snippets/toolbar/index.vue'
import ComboboxExample from '../../../../snippets/combobox/index.vue'
import SelectExample from '../../../../snippets/selects/index.vue'
import CalendarExample from '../../../../snippets/calendar/index.vue'
import CollapseExample from '../../../../snippets/collapse/index.vue'
import ScrollAreaExample from '../../../../snippets/scrollArea/index.vue'
import CountdownExample from '../../../../snippets/countdown/index.vue'
import PopoverExample from '../../../../snippets/popover/index.vue'
import ModalExample from '../../../../snippets/modal/index.vue'
import PreviewExample from '../../../../snippets/preview/index.vue'

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
  <div v-if="show" class="py-24 sm:py-32 hidden lg:block !pt-12">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
      <div class="flex flex-col lg:grid gap-8 relative lg:grid-cols-10 lg:gap-8 overflow-hidden p-px">
        <div :ref="(el) => (refs[1] = el)" class="col-span-8 flex items-center animate-top p-10px">
          <SliderExample class="w-full!" />
        </div>

        <div :ref="(el) => (refs[2] = el)" class="col-span-2 row-span-2 flex items-center animate-right">
          <RadioExample />
        </div>

        <div :ref="(el) => (refs[4] = el)" class="col-span-2 animate-left z-10">
          <DropdownExample />
        </div>

        <div
          :ref="(el) => (refs[3] = el)"
          class="col-span-6 flex flex-wrap items-center justify-between gap-1 animate-bottom"
        >
          <ImageExample />
          <ButtonExample />
          <SwitchExample :label="false" />
          <PaginationExample />
        </div>

        <div :ref="(el) => (refs[5] = el)" class="col-span-3 row-span-8 gap-6 flex flex-col justify-between animate-left">
          <InfoExample class="w-full!" />
          <div class="flex justify-between items-center">
            <ModalExample />
            <PopoverExample />
          </div>
          <TabsExample class="w-full!" />
        </div>

        <div :ref="(el) => (refs[6] = el)" class="col-span-5 row-span-2 flex flex-col animate-bottom">
          <ToolbarExample />
          <CollapseExample />
        </div>

        <div :ref="(el) => (refs[7] = el)" class="col-span-2 row-span-2 gap-6 flex flex-col animate-right z-10">
          <CheckboxExample />
          <ComboboxExample />
          <SelectExample />
          <CountdownExample />
        </div>

        <div :ref="(el) => (refs[8] = el)" class="col-span-7 row-span-6 flex flex-wrap items-center justify-between gap-1 animate-bottom">
          <ScrollAreaExample />
          <CalendarExample />
          <PreviewExample />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-top {
  animation: translateDown;
}

.animate-bottom {
  animation: translateUp;
}

.animate-left {
  animation: translateLeft;
}

.animate-right {
  animation-name: translateRight;
}

@keyframes translateDown {
  0% {
    transform: translate3D(0, -100px, 0);
    opacity: 0;
  }

  100% {
    transform: translateY(0, 0, 0);
    opacity: 1;
  }
}

@keyframes translateUp {
  0% {
    transform: translate3D(0, 100px, 0);
    opacity: 0;
  }

  100% {
    transform: translateY(0, 0, 0);
    opacity: 1;
  }
}

@keyframes translateLeft {
  0% {
    transform: translate3D(-100px, 0, 0);
    opacity: 0;
  }

  100% {
    transform: translate3D(0, 0, 0);
    opacity: 1;
  }
}

@keyframes translateRight {
  0% {
    transform: translate3D(100px, 0, 0);
    opacity: 0;
  }

  100% {
    transform: translate3D(0, 0, 0);
    opacity: 1;
  }
}
</style>
