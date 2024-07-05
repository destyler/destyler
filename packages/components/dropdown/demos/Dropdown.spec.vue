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
} from '../src'

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
  console.log(ev)
}
</script>

<template>
  <div>
    <DropdownRoot v-model:open="toggleState">
      <DropdownTrigger
        aria-label="Customise options"
      >
        <Icon name="radix-icons:hamburger-menu" />
      </DropdownTrigger>

      <DropdownPortal to="#here">
        <DropdownContent>
          <DropdownItem
            value="New Tab"
            v-bind="useEmitAsProps(emits)"
            @click="handleClick"
          >
            New Tab
            <div>
              ⌘+T
            </div>
          </DropdownItem>
          <!-- <DropdownSub>
            <DropdownSubTrigger
              value="more toolsz"
            >
              More Tools
              <div
              >
                <Icon name="radix-icons:chevron-right" />
              </div>
            </DropdownSubTrigger>
            <DropdownPortal>
              <DropdownSubContent
                :side-offset="2"
                :align-offset="-5"
              >
                <DropdownItem
                >
                  Save Page As…
                  <div
                  >
                    ⌘+S
                  </div>
                </DropdownItem>
                <DropdownItem
                >
                  Create Shortcut…
                </DropdownItem>
                <DropdownItem
                >
                  Name Window…
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                >
                  Developer Tools
                </DropdownItem>
              </DropdownSubContent>
            </DropdownPortal>
          </DropdownSub> -->
          <DropdownItem
            value="New Window"
          >
            New Window
            <div>
              ⌘+N
            </div>
          </DropdownItem>
          <DropdownItem
            value="New Private Window"
            disabled
          >
            New Private Window
            <div>
              ⇧+⌘+N
            </div>
          </DropdownItem>
          <!-- <DropdownSub>
            <DropdownSubTrigger
              value="more tools"
            >
              More Tools
              <div
              >
                <Icon name="radix-icons:chevron-right" />
              </div>
            </DropdownSubTrigger>
            <DropdownPortal>
              <DropdownSubContent
                :side-offset="2"
                :align-offset="-5"
              >
                <DropdownItem
                >
                  Save Page As…
                  <div
                  >
                    ⌘+S
                  </div>
                </DropdownItem>
                <DropdownItem
                >
                  Create Shortcut…
                </DropdownItem>
                <DropdownItem
                >
                  Name Window…
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                >
                  Developer Tools
                </DropdownItem>
                <DropdownSub>
                  <DropdownSubTrigger
                    value="more toolsz"
                  >
                    More Tools
                    <div
                    >
                      <Icon name="radix-icons:chevron-right" />
                    </div>
                  </DropdownSubTrigger>
                  <DropdownPortal>
                    <DropdownSubContent
                      :side-offset="2"
                      :align-offset="-5"
                    >
                      <DropdownItem
                      >
                        Save Page As…
                        <div
                        >
                          ⌘+S
                        </div>
                      </DropdownItem>
                      <DropdownItem
                      >
                        Create Shortcut…
                      </DropdownItem>
                      <DropdownItem
                      >
                        Name Window…
                      </DropdownItem>
                      <DropdownSeparator
                      />
                      <DropdownItem
                      >
                        Developer Tools
                      </DropdownItem>
                      <DropdownSub>
                        <DropdownSubTrigger
                          value="more toolsz"
                        >
                          More Tools
                          <div
                          >
                            <Icon name="radix-icons:chevron-right" />
                          </div>
                        </DropdownSubTrigger>
                        <DropdownPortal>
                          <DropdownSubContent
                            :side-offset="2"
                            :align-offset="-5"
                          >
                            <DropdownItem
                            >
                              Save Page As…
                              <div
                              >
                                ⌘+S
                              </div>
                            </DropdownItem>
                            <DropdownItem
                            >
                              Create Shortcut…
                            </DropdownItem>
                            <DropdownItem
                            >
                              Name Window…
                            </DropdownItem>
                            <DropdownSeparator
                            />
                            <DropdownItem
                            >
                              Developer Tools
                            </DropdownItem>
                          </DropdownSubContent>
                        </DropdownPortal>
                      </DropdownSub>
                    </DropdownSubContent>
                  </DropdownPortal>
                </DropdownSub>
                <DropdownItem
                >
                  Developer Tools
                </DropdownItem>
              </DropdownSubContent>
            </DropdownPortal>
          </DropdownSub> -->
          <DropdownSeparator />
          <DropdownCheckboxItem
            v-model:checked="checkboxOne"
            @select="handleCheck"
          >
            <DropdownItemIndicator>
              <Icon name="radix-icons:check" />
            </DropdownItemIndicator>
            Show Bookmarks
            <div>
              ⌘+B
            </div>
          </DropdownCheckboxItem>
          <DropdownCheckboxItem
            v-model:checked="checkboxTwo"
          >
            <DropdownItemIndicator>
              <Icon name="radix-icons:check" />
            </DropdownItemIndicator>
            Show Full URLs
          </DropdownCheckboxItem>
          <DropdownSeparator />

          <DropdownLabel>
            People
          </DropdownLabel>
          <DropdownRadioGroup v-model="person">
            <DropdownRadioItem
              value="pedro"
            >
              <DropdownItemIndicator>
                <Icon name="radix-icons:dot-filled" />
              </DropdownItemIndicator>
              Pedro Duarte
            </DropdownRadioItem>
            <DropdownRadioItem
              value="colm"
            >
              <DropdownItemIndicator>
                <Icon name="radix-icons:dot-filled" />
              </DropdownItemIndicator>
              Colm Tuite
            </DropdownRadioItem>
          </DropdownRadioGroup>
          <DropdownArrow />
        </DropdownContent>
      </DropdownPortal>
    </DropdownRoot>

    <div id="here" />
  </div>
</template>
