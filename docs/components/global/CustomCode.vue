<script setup lang="ts">
import {
  Button,
  Icon,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'destyler'
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  icon: string
  name: string
}>()

const slots = useSlots()

// @ts-expect-error - This is a bug in Volar, it should be able to infer the type of the slot
const source = computed(() => slots.default()[0].props.code)

const { copy } = useClipboard({ source })
</script>

<template>
  <TabsRoot class="w-full mt-4" default-value="hello">
    <TabsList
      class="flex items-center justify-between gap-1 bg-#F4F4F5 dark:bg-#27272A border border-black border-op-20 dark:border-white dark:border-op-20 border-b-0 rounded-t-md overflow-hidden p-2"
    >
      <div>
        <TabsTrigger
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-#FFFFFF dark:data-[state=active]:bg-#09090B data-[state=active]:text-#09090B dark:data-[state=active]:text-#FAFAFA data-[state=active]:shadow"
          value="hello"
        >
          <Icon :name="props.icon" class="w-4 h-4" />
          <span class="ml-2">{{ props.name }}</span>
        </TabsTrigger>
      </div>
      <Button class="mr-2" @click="copy(source)">
        <Icon class="w-4 h-4 text-dark dark:text-light text-op-50! hover:text-op-100!" name="carbon:copy" />
      </Button>
    </TabsList>
    <TabsContent
      class="relative [&>pre]:!rounded-t-none [&>pre]:!my-0 border border-black border-op-20 dark:border-white dark:border-op-20 border-t-0 rounded-b-md"
      value="hello"
    >
      <slot />
    </TabsContent>
  </TabsRoot>
</template>
