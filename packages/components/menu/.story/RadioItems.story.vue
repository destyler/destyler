<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
} from '../src'
import MenuWithAnchor from './components/MenuWithAnchor.vue'

const files = ['readme.md', 'index.js', 'page.css']

const selectedFiles = ref(files[1])

function handleSelect(text: string) {
  // eslint-disable-next-line no-console
  console.log({ text })
}
</script>

<template>
  <Story title="Menu/RadioItems">
    <Variant title="default">
      <MenuWithAnchor>
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:bg-black data-[highlighted]:text-white data-[disabled]:text-gray-100"
          @select="handleSelect('minize')"
        >
          Minimize window
        </MenuItem>
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:bg-black data-[highlighted]:text-white data-[disabled]:text-gray-100"
          @select="handleSelect('zoom')"
        >
          Zoom
        </MenuItem>
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:bg-black data-[highlighted]:text-white data-[disabled]:text-gray-100"
          @select="handleSelect('Smaller')"
        >
          Smaller
        </MenuItem>

        <MenuSeparator class="h-[1px] my-[5px] mx-[10px] bg-gray-200" />

        <MenuRadioGroup v-model="selectedFiles">
          <MenuRadioItem
            v-for="(file, index) in files"
            :key="index"
            :value="file"
            class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:bg-black data-[highlighted]:text-white data-[disabled]:text-gray-100"
          >
            {{ file }}
            <MenuItemIndicator>
              <Icon name="ri:check-line" />
            </MenuItemIndicator>
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuWithAnchor>
    </Variant>
  </Story>
</template>
