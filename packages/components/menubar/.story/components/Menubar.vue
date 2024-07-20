<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarItemIndicator,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
} from '../../src'

const emits = defineEmits(['select'])
const currentMenu = ref('')
const checkboxOne = ref(false)
const checkboxTwo = ref(false)
const person = ref('pedro')
function handleClick() {
  /* eslint-disable-next-line no-alert */
  alert('hello!')
}
</script>

<template>
  <div>
    <MenubarRoot
      v-model="currentMenu"
      :loop="true"
      class="flex bg-white p-[3px] rounded-md shadow-[0_2px_10px] shadow-blackA7"
    >
      <MenubarMenu value="file">
        <MenubarTrigger
          class="py-2 px-3 outline-none select-none font-medium leading-none rounded text-green11 text-[13px] flex items-center justify-between gap-[2px] data-[highlighted]:bg-green4 data-[state=open]:bg-green4"
        >
          File
        </MenubarTrigger>
        <MenubarPortal to="#here">
          <MenubarContent
            class="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
            align="start"
            :side-offset="5"
            :align-offset="-3"
          >
            <MenubarItem
              class="group text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
              v-bind="useEmitAsProps(emits)"
            >
              New Tab
              <div
                class="ml-auto pl-5 text-mauve9 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⌘ T
              </div>
            </MenubarItem>
            <MenubarItem
              class="group text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              New Window
              <div
                class="ml-auto pl-5 text-mauve9 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⌘ N
              </div>
            </MenubarItem>
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
              disabled
            >
              New Incognito Window
            </MenubarItem>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarItem
              class="group text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Print…
              <div
                class="ml-auto pl-5 text-mauve9 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⌘ P
              </div>
            </MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger
          class="py-2 px-3 outline-none select-none font-medium leading-none rounded text-green11 text-[13px] flex items-center justify-between gap-[2px] data-[highlighted]:bg-green4 data-[state=open]:bg-green4"
        >
          Edit
        </MenubarTrigger>
        <MenubarPortal to="#here">
          <MenubarContent
            class="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
            align="start"
            :side-offset="5"
            :align-offset="-3"
          >
            <MenubarItem
              class="group text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Undo
              <div
                class="ml-auto pl-5 text-mauve9 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⌘ Z
              </div>
            </MenubarItem>
            <MenubarItem
              class="group text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Redo
              <div
                class="ml-auto pl-5 text-mauve9 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⇧ ⌘ Z
              </div>
            </MenubarItem>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Cut
            </MenubarItem>
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Copy
            </MenubarItem>
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Paste
            </MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger
          class="py-2 px-3 outline-none select-none font-medium leading-none rounded text-green11 text-[13px] flex items-center justify-between gap-[2px] data-[highlighted]:bg-green4 data-[state=open]:bg-green4"
        >
          View
        </MenubarTrigger>
        <MenubarPortal to="#here">
          <MenubarContent
            class="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
            align="start"
            :side-offset="5"
            :align-offset="-14"
          >
            <MenubarCheckboxItem
              v-model="checkboxOne"
              class="group text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[20px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            >
              <MenubarItemIndicator
                class="absolute left-0 w-[20px] inline-flex items-center justify-center"
              >
                <Icon name="radix-icons:check" />
              </MenubarItemIndicator>
              Show Bookmarks
              <div
                class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⌘+B
              </div>
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              v-model="checkboxTwo"
              class="text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[20px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            >
              <MenubarItemIndicator
                class="absolute left-0 w-[20px] inline-flex items-center justify-center"
              >
                <Icon name="radix-icons:check" />
              </MenubarItemIndicator>
              Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarItem
              class="group text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none pl-5 outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Reload
              <div
                class="ml-auto pl-5 text-mauve9 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⌘ R
              </div>
            </MenubarItem>
            <MenubarItem
              class="group text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none pl-5 outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
              disabled
            >
              Force Reload
              <div
                class="ml-auto pl-5 text-mauve9 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                ⇧ ⌘ R
              </div>
            </MenubarItem>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none pl-5 outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Toggle Fullscreen
            </MenubarItem>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none pl-5 outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Hide Sidebar
            </MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger
          class="py-2 px-3 outline-none select-none font-medium leading-none rounded text-green11 text-[13px] flex items-center justify-between gap-[2px] data-[highlighted]:bg-green4 data-[state=open]:bg-green4"
        >
          Profiles
        </MenubarTrigger>
        <MenubarPortal to="#here">
          <MenubarContent
            class="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
            align="start"
            :side-offset="5"
            :align-offset="-14"
          >
            <MenubarRadioGroup v-model="person">
              <MenubarRadioItem
                class="text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[20px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                value="pedro"
              >
                <MenubarItemIndicator
                  class="absolute left-0 w-[20px] inline-flex items-center justify-center"
                >
                  <Icon name="radix-icons:dot-filled" />
                </MenubarItemIndicator>
                Pedro Duarte
              </MenubarRadioItem>
              <MenubarRadioItem
                class="text-[13px] leading-none text-green11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[20px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                value="colm"
              >
                <MenubarItemIndicator
                  class="absolute left-0 w-[20px] inline-flex items-center justify-center"
                >
                  <Icon name="radix-icons:dot-filled" />
                </MenubarItemIndicator>
                Colm Tuite
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none pl-5 outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
              @click="handleClick"
            >
              Edit…
            </MenubarItem>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]" />
            <MenubarItem
              class="text-[13px] leading-none text-green11 rounded flex items-center h-[25px] px-[10px] relative select-none pl-5 outline-none data-[state=open]:bg-green4 data-[state=open]:text-green11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
            >
              Add Profile…
            </MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </MenubarRoot>

    <div id="here" />
  </div>
</template>
