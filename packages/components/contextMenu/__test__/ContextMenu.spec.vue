<script setup lang="ts">
import { ref } from 'vue'
import {
  ContextMenuArrow,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../src'

const checkboxOne = ref(false)
const checkboxTwo = ref(false)
const person = ref('pedro')

function handleClick() {
  // eslint-disable-next-line no-alert
  alert('hello!')
}
</script>

<template>
  <ContextMenuRoot :modal="true">
    <ContextMenuTrigger>
      Right click here.
    </ContextMenuTrigger>

    <ContextMenuPortal>
      <ContextMenuContent
        :side-offset="5"
      >
        <ContextMenuItem
          value="New Tab"
          @click="handleClick"
        >
          New Tab
          <div>
            ⌘+T
          </div>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger
            value="more toolsz"
          >
            More Tools
            <div>
              <svg name="chevron-right">
                <path />
              </svg>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent
              :side-offset="2"
              :align-offset="-5"
            >
              <ContextMenuItem>
                Save Page As…
                <div>
                  ⌘+S
                </div>
              </ContextMenuItem>
              <ContextMenuItem>
                Create Shortcut…
              </ContextMenuItem>
              <ContextMenuItem>
                Name Window…
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                Developer Tools
              </ContextMenuItem>

              <ContextMenuArrow />
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>
        <ContextMenuItem
          value="New Window"
        >
          New Window
          <div>
            ⌘+N
          </div>
        </ContextMenuItem>
        <ContextMenuItem
          value="New Private Window"
          disabled
        >
          New Private Window
          <div>
            ⇧+⌘+N
          </div>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger
            value="more tools"
          >
            More Tools
            <div>
              <svg name="right">
                <path />
              </svg>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent
              :side-offset="2"
              :align-offset="-5"
            >
              <ContextMenuItem>
                Save Page As…
                <div>
                  ⌘+S
                </div>
              </ContextMenuItem>
              <ContextMenuItem>
                Create Shortcut…
              </ContextMenuItem>
              <ContextMenuItem>
                Name Window…
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                Developer Tools
              </ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger
                  value="more toolsz"
                >
                  More Tools
                  <div>
                    <svg name="right">
                      <path />
                    </svg>
                  </div>
                </ContextMenuSubTrigger>
                <ContextMenuPortal>
                  <ContextMenuSubContent
                    :side-offset="2"
                    :align-offset="-5"
                  >
                    <ContextMenuItem>
                      Save Page As…
                      <div>
                        ⌘+S
                      </div>
                    </ContextMenuItem>
                    <ContextMenuItem>
                      Create Shortcut…
                    </ContextMenuItem>
                    <ContextMenuItem>
                      Name Window…
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                      Developer Tools
                    </ContextMenuItem>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger
                        value="more toolsz"
                      >
                        More Tools
                        <div>
                          <svg name="right">
                            <path />
                          </svg>
                        </div>
                      </ContextMenuSubTrigger>
                      <ContextMenuPortal>
                        <ContextMenuSubContent
                          :side-offset="2"
                          :align-offset="-5"
                        >
                          <ContextMenuItem>
                            Save Page As…
                            <div>
                              ⌘+S
                            </div>
                          </ContextMenuItem>
                          <ContextMenuItem>
                            Create Shortcut…
                          </ContextMenuItem>
                          <ContextMenuItem>
                            Name Window…
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem>
                            Developer Tools
                          </ContextMenuItem>
                        </ContextMenuSubContent>
                      </ContextMenuPortal>
                    </ContextMenuSub>
                  </ContextMenuSubContent>
                </ContextMenuPortal>
              </ContextMenuSub>
              <ContextMenuItem>
                Developer Tools
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          v-model:checked="checkboxOne"
          @select.prevent
        >
          <ContextMenuItemIndicator>
            <svg name="check">
              <path />
            </svg>
          </ContextMenuItemIndicator>
          Show Bookmarks
          <div>
            ⌘+B
          </div>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          v-model:checked="checkboxTwo"
          @select.prevent
        >
          <ContextMenuItemIndicator>
            <svg name="check">
              <path />
            </svg>
          </ContextMenuItemIndicator>
          Show Full URLs
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />

        <ContextMenuLabel>
          People
        </ContextMenuLabel>
        <ContextMenuRadioGroup v-model="person">
          <ContextMenuRadioItem
            value="pedro"
          >
            <ContextMenuItemIndicator>
              <svg name="dot">
                <path />
              </svg>
            </ContextMenuItemIndicator>
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            value="colm"
          >
            <ContextMenuItemIndicator>
              <svg name="dot">
                <path />
              </svg>
            </ContextMenuItemIndicator>
            Colm Tuite
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
