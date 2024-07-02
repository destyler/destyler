<script setup lang="ts">
import { ref } from 'vue'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
  ComboboxViewport,
} from '../src'

const frameworks = ref([
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
])

const value = ref('')

const open = ref(true)
</script>

<template>
  <div class="w-200px! flex flex-col z-50 rounded-md border dark:border-#09090B dark:bg-#09090B dark:text-#FAFAFA shadow-md outline-none w-full">
    <ComboboxRoot
      v-model="value"
      v-model:open="open"
      :default-open="true"
      class="flex h-full w-full flex-col overflow-hidden rounded-md bg-white dark:bg-#09090B text-#09090B dark:text-#FAFAFA"
    >
      <div class="flex items-center border-b px-3">
        <ComboboxInput
          class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-#71717A dark:placeholder:text-#A1A1AA disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Select framework..."
        />
      </div>
      <ComboboxEmpty class="py-6 text-center text-sm">
        No framework found.
      </ComboboxEmpty>
      <ComboboxContent
        class="max-h-[300px] overflow-y-auto overflow-x-hidden"
      >
        <ComboboxViewport>
          <ComboboxGroup class="overflow-hidden p-1 text-#09090B dark:text-#FAFAFA ">
            <ComboboxItem
              v-for="framework in frameworks"
              :key="framework.value"
              class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-#F4F4F5 dark:data-[highlighted]:bg-#27272A data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              :value="framework.value"
            >
              {{ framework.label }}
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxRoot>
  </div>
</template>
