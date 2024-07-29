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
const toggleState = ref(true)
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
