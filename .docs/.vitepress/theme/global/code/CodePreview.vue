<script setup lang="ts">
import { Icon, TabsContent, TabsList, TabsRoot, TabsTrigger } from 'destyler'
import { ref } from 'vue'

const props = defineProps<{
  tabs: { value: string, label: string, icon: string }[]
}>()

const value = ref(props.tabs[0].value)
</script>

<template>
  <ClientOnly>
    <TabsRoot v-model="value" class="w-full mt-4">
      <TabsList
        class="relative flex items-center justify-between gap-1 bg-#F4F4F5 dark:bg-#27272A border border-black border-op-20 dark:border-white dark:border-op-20 border-b-0 rounded-t-md overflow-hidden p-2"
      >
        <TabsTrigger
          v-for="tab in props.tabs"
          :key="tab.value"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
          :value="tab.value"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          <span class="ml-2">{{ tab.label }}</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        v-for="tab in props.tabs"
        :key="tab.value"
        class="relative [&>pre]:!rounded-t-none [&>pre]:!my-0 border border-black border-op-20 dark:border-white dark:border-op-20 border-t-0 rounded-b-md"
        :value="tab.value"
      >
        <slot :name="tab.value" />
      </TabsContent>
    </TabsRoot>
  </ClientOnly>
</template>
