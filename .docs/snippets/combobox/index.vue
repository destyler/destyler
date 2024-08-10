<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxSeparator, ComboboxTrigger, ComboboxViewport } from '@destyler/combobox'

const value = ref('')

const options = ref([
  {
    label: 'frontend',
    items: ['vue', 'nuxt', 'react', 'next', 'svelte', 'svelte kit', 'angular'],

  },
  {
    label: 'backend',
    items: ['nitro', 'express', 'nest', 'koa', 'adonis'],
  },
])
</script>

<template>
  <ComboboxRoot
    v-model="value"
    class="relative"
  >
    <ComboboxAnchor
      class="
      flex h-9 w-full rounded-md
      border border-input bg-transparent
      px-1 text-sm shadow-sm
      transition-colors file:border-0
      file:bg-transparent file:text-sm file:font-medium
      placeholder:text-muted-foreground focus-visible:outline-none
      focus-visible:ring-1 focus-visible:ring-ring
      disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      <ComboboxInput
        class="bg-transparent text-primary w-full outline-none ml-2"
        placeholder="Placeholder..."
      />
      <ComboboxTrigger class="[&[data-state=open]>svg]:rotate-180">
        <Icon
          class="w-4 h-4 text-primary/80 transition-transform duration-150"
          name="carbon:chevron-down"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxContent
      class="
      absolute z-10 mt-1 w-full
      rounded-md border bg-popover
      p-1 text-popover-foreground
      shadow-md outline-none
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0
      data-[state=open]:fade-in-0
      data-[state=closed]:zoom-out-95
      data-[state=open]:zoom-in-95
      data-[side=bottom]:slide-in-from-top-2
      data-[side=left]:slide-in-from-right-2
      data-[side=right]:slide-in-from-left-2
      data-[side=top]:slide-in-from-bottom-2
      "
    >
      <ComboboxViewport>
        <ComboboxEmpty class="py-3 text-center text-sm" />
        <ComboboxGroup
          v-for="(option, index) of options"
          :key="option.label"
          class="overflow-hidden p-1"
        >
          <ComboboxLabel
            class="
            overflow-hidden text-foreground/50
            flex justify-start items-center
            w-full px-2 py-1
            "
          >
            {{ option.label }}
          </ComboboxLabel>
          <ComboboxItem
            v-for="item in option.items"
            :key="item"
            :value="item"
            class="
            overflow-hidden text-foreground
            flex justify-start items-center
            w-full px-2 py-1
            data-[highlighted]:bg-accent
            data-[highlighted]:rounded
            "
          >
            <span>{{ item }}</span>
            <ComboboxItemIndicator class="ml-auto h-4 w-4">
              <Icon name="carbon:checkmark" />
            </ComboboxItemIndicator>
          </ComboboxItem>
          <ComboboxSeparator v-show="index !== options.length - 1" class="h-0.25 bg-foreground/60 m-1" />
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
