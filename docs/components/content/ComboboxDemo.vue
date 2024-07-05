<script setup lang="ts">
import {
  Button,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
  Icon,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'destyler'

const frameworks = ref([
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
])

const open = ref(false)

const value = ref('')

watch(value, () => {
  open.value = false
})
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger>
      <Button class="w-200px inline-flex items-center justify-between whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border border-#E4E4E7 dark:border-#27272A bg-white dark:bg-#09090B shadow-sm hover:bg-#F4F4F5 dark:hover:bg-#27272A hover:text-#18181B dark:hover:text-#FAFAFA h-9 px-4 py-2">
        {{ value
          ? frameworks.find((framework) => framework.value === value)?.label
          : "Select framework..." }}
        <Icon
          name="radix-icons:caret-sort"
          class="ml-2 h-4 w-4 shrink-0 opacity-50"
        />
      </Button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        class="w-[200px]"
        :side-offset="5"
      >
        <div class="flex flex-col z-50 rounded-md border dark:border-#09090B dark:bg-#09090B dark:text-#FAFAFA shadow-md outline-none w-full">
          <ComboboxRoot
            :default-open="true"
            class="flex h-full w-full flex-col overflow-hidden rounded-md bg-white dark:bg-#09090B text-#09090B dark:text-#FAFAFA"
          >
            <ComboboxAnchor class="flex items-center border-b px-3">
              <Icon
                class="mr-2 h-4 w-4 shrink-0 opacity-50"
                name="radix-icons:magnifying-glass"
              />
              <ComboboxInput
                class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-#71717A dark:placeholder:text-#A1A1AA disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Select framework..."
              />
            </ComboboxAnchor>
            <ComboboxEmpty class="py-6 text-center text-sm">
              No framework found.
            </ComboboxEmpty>
            <ComboboxContent
              class="max-h-[300px] overflow-y-auto overflow-x-hidden"
            >
              <div>
                <ComboboxGroup class="overflow-hidden p-1 text-#09090B dark:text-#FAFAFA ">
                  <ComboboxItem
                    v-for="framework in frameworks"
                    :key="framework.value"
                    class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-#F4F4F5 dark:data-[highlighted]:bg-#27272A data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    :value="framework.value"
                    @select="(ev) => {
                      if (typeof ev.detail.value === 'string') {
                        value = ev.detail.value
                      }
                    }"
                  >
                    {{ framework.label }}
                    <Icon name="radix-icons:check" class="ml-auto h-4 w-4" :class="value === framework.value ? 'opacity-100' : 'opacity-0'" />
                  </ComboboxItem>
                </ComboboxGroup>
              </div>
            </ComboboxContent>
          </ComboboxRoot>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
