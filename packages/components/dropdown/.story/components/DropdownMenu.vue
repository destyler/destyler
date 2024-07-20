<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import {
  DropdownArrow,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownItem,
  DropdownItemIndicator,
  DropdownLabel,
  DropdownPortal,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownRoot,
  DropdownSeparator,
  DropdownTrigger,
} from '../../src'

const props = defineProps<{ defaultOpen?: boolean }>()

const emits = defineEmits(['select'])
const toggleState = ref(props.defaultOpen ?? false)
const checkboxOne = ref(false)
const checkboxTwo = ref(false)
const person = ref('pedro')

function handleClick() {
  // alert("hello!");
}

function handleCheck(ev: any) {
  // checkboxOne.value = ev;
  /* eslint-disable-next-line no-console */
  console.log(ev)
}
</script>

<template>
  <div>
    <DropdownRoot v-model:open="toggleState">
      <DropdownTrigger
        class="rounded-full w-8 h-8 inline-flex items-center justify-center text-green11 bg-white shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-green3 focus:shadow-[0_0_0_2px] focus:shadow-black"
        aria-label="Customise options"
      >
        <Icon name="radix-icons:hamburger-menu" />
      </DropdownTrigger>

      <DropdownPortal to="#here">
        <DropdownContent
          class="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
        >
          <DropdownItem
            value="New Tab"
            class="group text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            v-bind="useEmitAsProps(emits)"
            @click="handleClick"
          >
            New Tab
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⌘+T
            </div>
          </DropdownItem>
          <DropdownItem
            value="New Window"
            class="group text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          >
            New Window
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⌘+N
            </div>
          </DropdownItem>
          <DropdownItem
            value="New Private Window"
            class="group text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            disabled
          >
            New Private Window
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⇧+⌘+N
            </div>
          </DropdownItem>
          <DropdownSeparator class="h-[1px] bg-green6 m-[5px]" />
          <DropdownCheckboxItem
            v-model:checked="checkboxOne"
            class="group text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            @select="handleCheck"
          >
            <DropdownItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <Icon name="radix-icons:check" />
            </DropdownItemIndicator>
            Show Bookmarks
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⌘+B
            </div>
          </DropdownCheckboxItem>
          <DropdownCheckboxItem
            v-model:checked="checkboxTwo"
            class="text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          >
            <DropdownItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <Icon name="radix-icons:check" />
            </DropdownItemIndicator>
            Show Full URLs
          </DropdownCheckboxItem>
          <DropdownSeparator class="h-[1px] bg-green6 m-[5px]" />

          <DropdownLabel
            class="pl-[25px] text-xs leading-[25px] text-mauve11"
          >
            People
          </DropdownLabel>
          <DropdownRadioGroup v-model="person">
            <DropdownRadioItem
              class="text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              value="pedro"
            >
              <DropdownItemIndicator
                class="absolute left-0 w-[25px] inline-flex items-center justify-center"
              >
                <Icon name="radix-icons:dot-filled" />
              </DropdownItemIndicator>
              Pedro Duarte
            </DropdownRadioItem>
            <DropdownRadioItem
              class="text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              value="colm"
            >
              <DropdownItemIndicator
                class="absolute left-0 w-[25px] inline-flex items-center justify-center"
              >
                <Icon name="radix-icons:dot-filled" />
              </DropdownItemIndicator>
              Colm Tuite
            </DropdownRadioItem>
          </DropdownRadioGroup>
          <DropdownArrow class="fill-white" />
        </DropdownContent>
      </DropdownPortal>
    </DropdownRoot>

    <div id="here" />
  </div>
</template>
