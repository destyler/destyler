<script setup lang="ts">
import { MenuItem, MenuSeparator } from '../src'
import MenuWithAnchor from './components/MenuWithAnchor.vue'

function handleSelect(text: string) {
  console.log({ text })
  window.alert(text)
}
</script>

<template>
  <Story
    title="Menu/Basic"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="default">
      <MenuWithAnchor>
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:text-white data-[highlighted]:bg-black data-[disabled]:text-gray-100"
          @select="handleSelect('undo')"
        >
          Undo
        </MenuItem>
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:text-white data-[highlighted]:bg-black data-[disabled]:text-gray-100"
          @select="handleSelect('redo')"
        >
          Redo
        </MenuItem>
        <MenuSeparator class="separatorClass" />
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:text-white data-[highlighted]:bg-black data-[disabled]:text-gray-100"
          disabled
          @select="handleSelect('cut')"
        >
          Cut
        </MenuItem>
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:text-white data-[highlighted]:bg-black data-[disabled]:text-gray-100"
          @select="handleSelect('copy')"
        >
          Copy
        </MenuItem>
        <MenuItem
          class="flex items-center justify-between leading-[1] cursor-default select-none whitespace-nowrap h-[25px] px-[10px] text-black rounded-[3px] outline-none data-[highlighted]:text-white data-[highlighted]:bg-black data-[disabled]:text-gray-100"
          @select="handleSelect('paste')"
        >
          Paste
        </MenuItem>
      </MenuWithAnchor>
    </Variant>
  </Story>
</template>
