<script setup lang="ts">
import { DestylerIcon } from '@destyler/icon'
import { ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
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
  DestylerDropdownTrigger,
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
    <DestylerDropdownRoot v-model:open="toggleState">
      <DestylerDropdownTrigger
        aria-label="Customise options"
      >
        <DestylerIcon name="radix-icons:hamburger-menu" />
      </DestylerDropdownTrigger>

      <DestylerDropdownPortal to="#here">
        <DestylerDropdownContent>
          <DestylerDropdownItem
            value="New Tab"
            v-bind="useEmitAsProps(emits)"
            @click="handleClick"
          >
            New Tab
            <div>
              ⌘+T
            </div>
          </DestylerDropdownItem>
          <!-- <DestylerDropdownSub>
            <DestylerDropdownSubTrigger
              value="more toolsz"
            >
              More Tools
              <div
              >
                <DestylerIcon name="radix-icons:chevron-right" />
              </div>
            </DestylerDropdownSubTrigger>
            <DestylerDropdownPortal>
              <DestylerDropdownSubContent
                :side-offset="2"
                :align-offset="-5"
              >
                <DestylerDropdownItem
                >
                  Save Page As…
                  <div
                  >
                    ⌘+S
                  </div>
                </DestylerDropdownItem>
                <DestylerDropdownItem
                >
                  Create Shortcut…
                </DestylerDropdownItem>
                <DestylerDropdownItem
                >
                  Name Window…
                </DestylerDropdownItem>
                <DestylerDropdownSeparator />
                <DestylerDropdownItem
                >
                  Developer Tools
                </DestylerDropdownItem>
              </DestylerDropdownSubContent>
            </DestylerDropdownPortal>
          </DestylerDropdownSub> -->
          <DestylerDropdownItem
            value="New Window"
          >
            New Window
            <div>
              ⌘+N
            </div>
          </DestylerDropdownItem>
          <DestylerDropdownItem
            value="New Private Window"
            disabled
          >
            New Private Window
            <div>
              ⇧+⌘+N
            </div>
          </DestylerDropdownItem>
          <!-- <DestylerDropdownSub>
            <DestylerDropdownSubTrigger
              value="more tools"
            >
              More Tools
              <div
              >
                <DestylerIcon name="radix-icons:chevron-right" />
              </div>
            </DestylerDropdownSubTrigger>
            <DestylerDropdownPortal>
              <DestylerDropdownSubContent
                :side-offset="2"
                :align-offset="-5"
              >
                <DestylerDropdownItem
                >
                  Save Page As…
                  <div
                  >
                    ⌘+S
                  </div>
                </DestylerDropdownItem>
                <DestylerDropdownItem
                >
                  Create Shortcut…
                </DestylerDropdownItem>
                <DestylerDropdownItem
                >
                  Name Window…
                </DestylerDropdownItem>
                <DestylerDropdownSeparator />
                <DestylerDropdownItem
                >
                  Developer Tools
                </DestylerDropdownItem>
                <DestylerDropdownSub>
                  <DestylerDropdownSubTrigger
                    value="more toolsz"
                  >
                    More Tools
                    <div
                    >
                      <DestylerIcon name="radix-icons:chevron-right" />
                    </div>
                  </DestylerDropdownSubTrigger>
                  <DestylerDropdownPortal>
                    <DestylerDropdownSubContent
                      :side-offset="2"
                      :align-offset="-5"
                    >
                      <DestylerDropdownItem
                      >
                        Save Page As…
                        <div
                        >
                          ⌘+S
                        </div>
                      </DestylerDropdownItem>
                      <DestylerDropdownItem
                      >
                        Create Shortcut…
                      </DestylerDropdownItem>
                      <DestylerDropdownItem
                      >
                        Name Window…
                      </DestylerDropdownItem>
                      <DestylerDropdownSeparator
                      />
                      <DestylerDropdownItem
                      >
                        Developer Tools
                      </DestylerDropdownItem>
                      <DestylerDropdownSub>
                        <DestylerDropdownSubTrigger
                          value="more toolsz"
                        >
                          More Tools
                          <div
                          >
                            <DestylerIcon name="radix-icons:chevron-right" />
                          </div>
                        </DestylerDropdownSubTrigger>
                        <DestylerDropdownPortal>
                          <DestylerDropdownSubContent
                            :side-offset="2"
                            :align-offset="-5"
                          >
                            <DestylerDropdownItem
                            >
                              Save Page As…
                              <div
                              >
                                ⌘+S
                              </div>
                            </DestylerDropdownItem>
                            <DestylerDropdownItem
                            >
                              Create Shortcut…
                            </DestylerDropdownItem>
                            <DestylerDropdownItem
                            >
                              Name Window…
                            </DestylerDropdownItem>
                            <DestylerDropdownSeparator
                            />
                            <DestylerDropdownItem
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
                >
                  Developer Tools
                </DestylerDropdownItem>
              </DestylerDropdownSubContent>
            </DestylerDropdownPortal>
          </DestylerDropdownSub> -->
          <DestylerDropdownSeparator />
          <DestylerDropdownCheckboxItem
            v-model:checked="checkboxOne"
            @select="handleCheck"
          >
            <DestylerDropdownItemIndicator>
              <DestylerIcon name="radix-icons:check" />
            </DestylerDropdownItemIndicator>
            Show Bookmarks
            <div>
              ⌘+B
            </div>
          </DestylerDropdownCheckboxItem>
          <DestylerDropdownCheckboxItem
            v-model:checked="checkboxTwo"
          >
            <DestylerDropdownItemIndicator>
              <DestylerIcon name="radix-icons:check" />
            </DestylerDropdownItemIndicator>
            Show Full URLs
          </DestylerDropdownCheckboxItem>
          <DestylerDropdownSeparator />

          <DestylerDropdownLabel>
            People
          </DestylerDropdownLabel>
          <DestylerDropdownRadioGroup v-model="person">
            <DestylerDropdownRadioItem
              value="pedro"
            >
              <DestylerDropdownItemIndicator>
                <DestylerIcon name="radix-icons:dot-filled" />
              </DestylerDropdownItemIndicator>
              Pedro Duarte
            </DestylerDropdownRadioItem>
            <DestylerDropdownRadioItem
              value="colm"
            >
              <DestylerDropdownItemIndicator>
                <DestylerIcon name="radix-icons:dot-filled" />
              </DestylerDropdownItemIndicator>
              Colm Tuite
            </DestylerDropdownRadioItem>
          </DestylerDropdownRadioGroup>
          <DestylerDropdownArrow />
        </DestylerDropdownContent>
      </DestylerDropdownPortal>
    </DestylerDropdownRoot>

    <div id="here" />
  </div>
</template>
