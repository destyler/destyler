<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import {
  DestylerDropdownArrow,
  DestylerDropdownCheckboxItem,
  DestylerDropdownContent,
  DestylerDropdownItem,
  DestylerDropdownItemIndicator,
  DestylerDropdownLabel,
  DestylerDropdownPortal,
  DestylerDropdownRadioGroup,
  DestylerDropdownRadioItem,
  DestylerDropdownRoot,
  DestylerDropdownSeparator,
  DestylerDropdownSub,
  DestylerDropdownSubContent,
  DestylerDropdownSubTrigger,
  DestylerDropdownTrigger,
} from '../src'

const toggleState = ref(false)
const checkboxOne = ref(false)
const checkboxTwo = ref(false)
const person = ref('pedro')

function handleClick() {
  alert('hello!')
}
</script>

<template>
  <DestylerDropdownRoot v-model:open="toggleState">
    <DestylerDropdownTrigger
      class="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-#71D083 bg-white shadow-[0_2px_10px] shadow-[rgba(0_0_0_0.5)] outline-none hover:bg-#132D21 focus:shadow-[0_0_0_2px] focus:shadow-black"
      aria-label="Customise options"
    >
      <Icon icon="radix-icons:hamburger-menu" />
    </DestylerDropdownTrigger>

    <DestylerDropdownPortal>
      <DestylerDropdownContent
        class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
        :side-offset="5"
      >
        <DestylerDropdownItem
          value="New Tab"
          class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
          @click="handleClick"
        >
          New Tab
          <div
            class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
          >
            ⌘+T
          </div>
        </DestylerDropdownItem>
        <DestylerDropdownSub>
          <DestylerDropdownSubTrigger
            value="more toolsz"
            class="group w-full text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-#71D083 data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512 data-[highlighted]:data-[state=open]:bg-#30A46C data-[highlighted]:data-[state=open]:text-#0E1512"
          >
            More Tools
            <div
              class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
            >
              <Icon icon="radix-icons:chevron-right" />
            </div>
          </DestylerDropdownSubTrigger>
          <DestylerDropdownPortal>
            <DestylerDropdownSubContent
              class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              :side-offset="2"
              :align-offset="-5"
            >
              <DestylerDropdownItem
                class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Save Page As…
                <div
                  class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
                >
                  ⌘+S
                </div>
              </DestylerDropdownItem>
              <DestylerDropdownItem
                class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Create Shortcut…
              </DestylerDropdownItem>
              <DestylerDropdownItem
                class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Name Window…
              </DestylerDropdownItem>
              <DestylerDropdownSeparator class="h-[1px] bg-green6 m-[5px]" />
              <DestylerDropdownItem
                class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Developer Tools
              </DestylerDropdownItem>
            </DestylerDropdownSubContent>
          </DestylerDropdownPortal>
        </DestylerDropdownSub>
        <DestylerDropdownItem
          value="New Window"
          class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
        >
          New Window
          <div
            class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
          >
            ⌘+N
          </div>
        </DestylerDropdownItem>
        <DestylerDropdownItem
          value="New Private Window"
          class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
          disabled
        >
          New Private Window
          <div
            class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
          >
            ⇧+⌘+N
          </div>
        </DestylerDropdownItem>
        <DestylerDropdownSub>
          <DestylerDropdownSubTrigger
            value="more tools"
            class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none w-full outline-none data-[state=open]:bg-green4 data-[state=open]:text-#71D083 data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512 data-[highlighted]:data-[state=open]:bg-#30A46C data-[highlighted]:data-[state=open]:text-#0E1512"
          >
            More Tools
            <div
              class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
            >
              <Icon icon="radix-icons:chevron-right" />
            </div>
          </DestylerDropdownSubTrigger>
          <DestylerDropdownPortal>
            <DestylerDropdownSubContent
              class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              :side-offset="2"
              :align-offset="-5"
            >
              <DestylerDropdownItem
                class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Save Page As…
                <div
                  class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
                >
                  ⌘+S
                </div>
              </DestylerDropdownItem>
              <DestylerDropdownItem
                class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Create Shortcut…
              </DestylerDropdownItem>
              <DestylerDropdownItem
                class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Name Window…
              </DestylerDropdownItem>
              <DestylerDropdownSeparator class="h-[1px] bg-green6 m-[5px]" />
              <DestylerDropdownItem
                class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Developer Tools
              </DestylerDropdownItem>
              <DestylerDropdownSub>
                <DestylerDropdownSubTrigger
                  value="more toolsz"
                  class="group w-full text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-#71D083 data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512 data-[highlighted]:data-[state=open]:bg-#30A46C data-[highlighted]:data-[state=open]:text-#0E1512"
                >
                  More Tools
                  <div
                    class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
                  >
                    <Icon icon="radix-icons:chevron-right" />
                  </div>
                </DestylerDropdownSubTrigger>
                <DestylerDropdownPortal>
                  <DestylerDropdownSubContent
                    class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                    :side-offset="2"
                    :align-offset="-5"
                  >
                    <DestylerDropdownItem
                      class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                    >
                      Save Page As…
                      <div
                        class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
                      >
                        ⌘+S
                      </div>
                    </DestylerDropdownItem>
                    <DestylerDropdownItem
                      class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                    >
                      Create Shortcut…
                    </DestylerDropdownItem>
                    <DestylerDropdownItem
                      class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                    >
                      Name Window…
                    </DestylerDropdownItem>
                    <DestylerDropdownSeparator class="h-[1px] bg-green6 m-[5px]" />
                    <DestylerDropdownItem
                      class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                    >
                      Developer Tools
                    </DestylerDropdownItem>
                    <DestylerDropdownSub>
                      <DestylerDropdownSubTrigger
                        value="more toolsz"
                        class="group w-full text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-#71D083 data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512 data-[highlighted]:data-[state=open]:bg-#30A46C data-[highlighted]:data-[state=open]:text-#0E1512"
                      >
                        More Tools
                        <div
                          class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
                        >
                          <Icon icon="radix-icons:chevron-right" />
                        </div>
                      </DestylerDropdownSubTrigger>
                      <DestylerDropdownPortal>
                        <DestylerDropdownSubContent
                          class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                          :side-offset="2"
                          :align-offset="-5"
                        >
                          <DestylerDropdownItem
                            class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                          >
                            Save Page As…
                            <div
                              class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
                            >
                              ⌘+S
                            </div>
                          </DestylerDropdownItem>
                          <DestylerDropdownItem
                            class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                          >
                            Create Shortcut…
                          </DestylerDropdownItem>
                          <DestylerDropdownItem
                            class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                          >
                            Name Window…
                          </DestylerDropdownItem>
                          <DestylerDropdownSeparator class="h-[1px] bg-green6 m-[5px]" />
                          <DestylerDropdownItem
                            class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
                          >
                            Developer Tools
                          </DestylerDropdownItem>
                        </DestylerDropdownSubContent>
                      </DestylerDropdownPortal>
                    </DestylerDropdownSub>
                  </DestylerDropdownSubContent>
                </DestylerDropdownPortal>
              </DestylerDropdownSub>
              <DestylerDropdownItem
                class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
              >
                Developer Tools
              </DestylerDropdownItem>
            </DestylerDropdownSubContent>
          </DestylerDropdownPortal>
        </DestylerDropdownSub>
        <DestylerDropdownSeparator class="h-[1px] bg-green6 m-[5px]" />
        <DestylerDropdownCheckboxItem
          v-model:checked="checkboxOne"
          class="group text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
        >
          <DestylerDropdownItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
            <Icon icon="radix-icons:check" />
          </DestylerDropdownItemIndicator>
          Show Bookmarks
          <div
            class="ml-auto pl-[20px] text-#B5B2BC group-data-[highlighted]:text-white group-data-[disabled]:text-#625F69"
          >
            ⌘+B
          </div>
        </DestylerDropdownCheckboxItem>
        <DestylerDropdownCheckboxItem
          v-model:checked="checkboxTwo"
          class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
        >
          <DestylerDropdownItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
            <Icon icon="radix-icons:check" />
          </DestylerDropdownItemIndicator>
          Show Full URLs
        </DestylerDropdownCheckboxItem>
        <DestylerDropdownSeparator class="h-[1px] bg-green6 m-[5px]" />

        <DestylerDropdownLabel class="pl-[25px] text-xs leading-[25px] text-#B5B2BC">
          People
        </DestylerDropdownLabel>
        <DestylerDropdownRadioGroup v-model="person">
          <DestylerDropdownRadioItem
            class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
            value="pedro"
          >
            <DestylerDropdownItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <Icon icon="radix-icons:dot-filled" />
            </DestylerDropdownItemIndicator>
            Pedro Duarte
          </DestylerDropdownRadioItem>
          <DestylerDropdownRadioItem
            class="text-[13px] leading-none text-#71D083 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-#625F69 data-[disabled]:pointer-events-none data-[highlighted]:bg-#30A46C data-[highlighted]:text-#0E1512"
            value="colm"
          >
            <DestylerDropdownItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <Icon icon="radix-icons:dot-filled" />
            </DestylerDropdownItemIndicator>
            Colm Tuite
          </DestylerDropdownRadioItem>
        </DestylerDropdownRadioGroup>
        <DestylerDropdownArrow class="fill-white" />
      </DestylerDropdownContent>
    </DestylerDropdownPortal>
  </DestylerDropdownRoot>
</template>
