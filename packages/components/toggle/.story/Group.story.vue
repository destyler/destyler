<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from '../src'

const toggleStateSingle = ref('center')

const toggleGroupItemClasses
  = 'hover:bg-green3 color-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-green12 flex h-[35px] w-[35px] items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none'
</script>

<template>
  <Story title="Toggle/Group" :layout="{ type: 'single', iframe: false }">
    <Variant title="default">
      <ToggleGroupRoot v-model="toggleStateSingle" class="flex">
        <ToggleGroupItem
          value="left"
          aria-label="Toggle italic"
          :class="toggleGroupItemClasses"
        >
          <Icon name="radix-icons:text-align-left" class="text-black" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="center"
          aria-label="Toggle italic"
          :class="toggleGroupItemClasses"
        >
          <Icon name="radix-icons:text-align-center" class="text-black" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="right"
          aria-label="Toggle italic"
          :class="toggleGroupItemClasses"
        >
          <Icon name="radix-icons:text-align-right" class="text-black" />
        </ToggleGroupItem>
      </ToggleGroupRoot>
      <br>
      <ToggleGroupRoot
        :default-value="['bold', 'italic']"
        type="multiple"
        class="flex"
      >
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle Bold"
          :class="toggleGroupItemClasses"
        >
          <Icon name="radix-icons:font-bold" class="text-black" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          :class="toggleGroupItemClasses"
        >
          <Icon name="radix-icons:font-italic" class="text-black" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strikethrough"
          aria-label="Toggle Strikethrough"
          :class="toggleGroupItemClasses"
        >
          <Icon name="radix-icons:strikethrough" class="text-black" />
        </ToggleGroupItem>
      </ToggleGroupRoot>
    </Variant>
  </Story>
</template>
