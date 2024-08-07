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

const slots = useSlots()

const value = ref('pnpm')

// @ts-expect-error - This is a bug in Volar, it should be able to infer the type of the slot
const source = ref(slots.pnpm()[0].props.code)

const { copy } = useClipboard({ source })

watch(value, (newValue) => {
  // @ts-expect-error - This is a bug in Volar, it should be able to infer the type of the slot
  source.value = slots[newValue]()[0].props.code
})
</script>

<template>
  <TabsRoot v-model="value" class="w-full mt-4">
    <TabsList
      class="flex items-center justify-between gap-1 bg-#F4F4F5 dark:bg-#27272A border border-black border-op-20 dark:border-white dark:border-op-20 border-b-0 rounded-t-md overflow-hidden p-2"
    >
      <div>
        <TabsTrigger
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-#FFFFFF dark:data-[state=active]:bg-#09090B data-[state=active]:text-#09090B dark:data-[state=active]:text-#FAFAFA data-[state=active]:shadow"
          value="npm"
        >
          <Icon name="vscode-icons:file-type-npm" class="w-4 h-4" />
          <span class="ml-2">npm</span>
        </TabsTrigger>
        <TabsTrigger
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-#FFFFFF dark:data-[state=active]:bg-#09090B data-[state=active]:text-#09090B dark:data-[state=active]:text-#FAFAFA data-[state=active]:shadow"
          value="yarn"
        >
          <Icon name="vscode-icons:file-type-yarn" class="w-4 h-4" />
          <span class="ml-2">yarn</span>
        </TabsTrigger>
        <TabsTrigger
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-#FFFFFF dark:data-[state=active]:bg-#09090B data-[state=active]:text-#09090B dark:data-[state=active]:text-#FAFAFA data-[state=active]:shadow"
          value="pnpm"
        >
          <Icon name="vscode-icons:file-type-light-pnpm" class="w-4 h-4" />
          <span class="ml-2">pnpm</span>
        </TabsTrigger>
      </div>
      <Button class="mr-2" @click="copy(source)">
        <Icon class="w-4 h-4 text-dark dark:text-light text-op-50! hover:text-op-100!" name="carbon:copy" />
      </Button>
    </TabsList>
    <TabsContent
      class="relative [&>pre]:!rounded-t-none [&>pre]:!my-0 border border-black border-op-20 dark:border-white dark:border-op-20 border-t-0 rounded-b-md"
      value="npm"
    >
      <slot name="npm" />
    </TabsContent>
    <TabsContent
      class="relative [&>pre]:!rounded-t-none [&>pre]:!my-0 border border-black border-op-20 dark:border-white dark:border-op-20 border-t-0 rounded-b-md"
      value="yarn"
    >
      <slot name="yarn" />
    </TabsContent>
    <TabsContent
      class="relative [&>pre]:!rounded-t-none [&>pre]:!my-0 border border-black border-op-20 dark:border-white dark:border-op-20 border-t-0 rounded-b-md"
      value="pnpm"
    >
      <slot name="pnpm" />
    </TabsContent>
  </TabsRoot>
</template>
