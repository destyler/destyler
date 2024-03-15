<script setup lang="ts">
import { ref } from 'vue'
import {
  DestylerContextMenuArrow,
  DestylerContextMenuCheckboxItem,
  DestylerContextMenuContent,
  DestylerContextMenuItem,
  DestylerContextMenuItemIndicator,
  DestylerContextMenuLabel,
  DestylerContextMenuPortal,
  DestylerContextMenuRadioGroup,
  DestylerContextMenuRadioItem,
  DestylerContextMenuRoot,
  DestylerContextMenuSeparator,
  DestylerContextMenuSub,
  DestylerContextMenuSubContent,
  DestylerContextMenuSubTrigger,
  DestylerContextMenuTrigger,
} from '../src'

const checkboxOne = ref(false)
const checkboxTwo = ref(false)
const person = ref('pedro')

function handleClick() {
  alert('hello!')
}
</script>

<template>
  <DestylerContextMenuRoot :modal="true">
    <DestylerContextMenuTrigger>
      Right click here.
    </DestylerContextMenuTrigger>

    <DestylerContextMenuPortal>
      <DestylerContextMenuContent
        :side-offset="5"
      >
        <DestylerContextMenuItem
          value="New Tab"
          @click="handleClick"
        >
          New Tab
          <div>
            ⌘+T
          </div>
        </DestylerContextMenuItem>
        <DestylerContextMenuSub>
          <DestylerContextMenuSubTrigger
            value="more toolsz"
          >
            More Tools
            <div>
              <svg name="chevron-right">
                <path />
              </svg>
            </div>
          </DestylerContextMenuSubTrigger>
          <DestylerContextMenuPortal>
            <DestylerContextMenuSubContent
              :side-offset="2"
              :align-offset="-5"
            >
              <DestylerContextMenuItem>
                Save Page As…
                <div>
                  ⌘+S
                </div>
              </DestylerContextMenuItem>
              <DestylerContextMenuItem>
                Create Shortcut…
              </DestylerContextMenuItem>
              <DestylerContextMenuItem>
                Name Window…
              </DestylerContextMenuItem>
              <DestylerContextMenuSeparator />
              <DestylerContextMenuItem>
                Developer Tools
              </DestylerContextMenuItem>

              <DestylerContextMenuArrow />
            </DestylerContextMenuSubContent>
          </DestylerContextMenuPortal>
        </DestylerContextMenuSub>
        <DestylerContextMenuItem
          value="New Window"
        >
          New Window
          <div>
            ⌘+N
          </div>
        </DestylerContextMenuItem>
        <DestylerContextMenuItem
          value="New Private Window"
          disabled
        >
          New Private Window
          <div>
            ⇧+⌘+N
          </div>
        </DestylerContextMenuItem>
        <DestylerContextMenuSub>
          <DestylerContextMenuSubTrigger
            value="more tools"
          >
            More Tools
            <div>
              <svg name="right">
                <path />
              </svg>
            </div>
          </DestylerContextMenuSubTrigger>
          <DestylerContextMenuPortal>
            <DestylerContextMenuSubContent
              :side-offset="2"
              :align-offset="-5"
            >
              <DestylerContextMenuItem>
                Save Page As…
                <div>
                  ⌘+S
                </div>
              </DestylerContextMenuItem>
              <DestylerContextMenuItem>
                Create Shortcut…
              </DestylerContextMenuItem>
              <DestylerContextMenuItem>
                Name Window…
              </DestylerContextMenuItem>
              <DestylerContextMenuSeparator />
              <DestylerContextMenuItem>
                Developer Tools
              </DestylerContextMenuItem>
              <DestylerContextMenuSub>
                <DestylerContextMenuSubTrigger
                  value="more toolsz"
                >
                  More Tools
                  <div>
                    <svg name="right">
                      <path />
                    </svg>
                  </div>
                </DestylerContextMenuSubTrigger>
                <DestylerContextMenuPortal>
                  <DestylerContextMenuSubContent
                    :side-offset="2"
                    :align-offset="-5"
                  >
                    <DestylerContextMenuItem>
                      Save Page As…
                      <div>
                        ⌘+S
                      </div>
                    </DestylerContextMenuItem>
                    <DestylerContextMenuItem>
                      Create Shortcut…
                    </DestylerContextMenuItem>
                    <DestylerContextMenuItem>
                      Name Window…
                    </DestylerContextMenuItem>
                    <DestylerContextMenuSeparator />
                    <DestylerContextMenuItem>
                      Developer Tools
                    </DestylerContextMenuItem>
                    <DestylerContextMenuSub>
                      <DestylerContextMenuSubTrigger
                        value="more toolsz"
                      >
                        More Tools
                        <div>
                          <svg name="right">
                            <path />
                          </svg>
                        </div>
                      </DestylerContextMenuSubTrigger>
                      <DestylerContextMenuPortal>
                        <DestylerContextMenuSubContent
                          :side-offset="2"
                          :align-offset="-5"
                        >
                          <DestylerContextMenuItem>
                            Save Page As…
                            <div>
                              ⌘+S
                            </div>
                          </DestylerContextMenuItem>
                          <DestylerContextMenuItem>
                            Create Shortcut…
                          </DestylerContextMenuItem>
                          <DestylerContextMenuItem>
                            Name Window…
                          </DestylerContextMenuItem>
                          <DestylerContextMenuSeparator />
                          <DestylerContextMenuItem>
                            Developer Tools
                          </DestylerContextMenuItem>
                        </DestylerContextMenuSubContent>
                      </DestylerContextMenuPortal>
                    </DestylerContextMenuSub>
                  </DestylerContextMenuSubContent>
                </DestylerContextMenuPortal>
              </DestylerContextMenuSub>
              <DestylerContextMenuItem>
                Developer Tools
              </DestylerContextMenuItem>
            </DestylerContextMenuSubContent>
          </DestylerContextMenuPortal>
        </DestylerContextMenuSub>
        <DestylerContextMenuSeparator />
        <DestylerContextMenuCheckboxItem
          v-model:checked="checkboxOne"
          @select.prevent
        >
          <DestylerContextMenuItemIndicator>
            <svg name="check">
              <path />
            </svg>
          </DestylerContextMenuItemIndicator>
          Show Bookmarks
          <div>
            ⌘+B
          </div>
        </DestylerContextMenuCheckboxItem>
        <DestylerContextMenuCheckboxItem
          v-model:checked="checkboxTwo"
          @select.prevent
        >
          <DestylerContextMenuItemIndicator>
            <svg name="check">
              <path />
            </svg>
          </DestylerContextMenuItemIndicator>
          Show Full URLs
        </DestylerContextMenuCheckboxItem>
        <DestylerContextMenuSeparator />

        <DestylerContextMenuLabel>
          People
        </DestylerContextMenuLabel>
        <DestylerContextMenuRadioGroup v-model="person">
          <DestylerContextMenuRadioItem
            value="pedro"
          >
            <DestylerContextMenuItemIndicator>
              <svg name="dot">
                <path />
              </svg>
            </DestylerContextMenuItemIndicator>
            Pedro Duarte
          </DestylerContextMenuRadioItem>
          <DestylerContextMenuRadioItem
            value="colm"
          >
            <DestylerContextMenuItemIndicator>
              <svg name="dot">
                <path />
              </svg>
            </DestylerContextMenuItemIndicator>
            Colm Tuite
          </DestylerContextMenuRadioItem>
        </DestylerContextMenuRadioGroup>
      </DestylerContextMenuContent>
    </DestylerContextMenuPortal>
  </DestylerContextMenuRoot>
</template>
