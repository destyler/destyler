<script setup lang="ts">
import { Button, Icon, TabsContent, TabsList, TabsRoot, TabsTrigger } from 'destyler'
import { ref } from 'vue'

const props = defineProps<{
  tabs: { value: string, label: string, icon: string }[]
}>()

const value = ref(props.tabs[0].value)

const isCopied = ref(false)
const source = ref('')
const { copy } = useClipboard({ source })
function handleCopy(e: any) {
  const el = e.target as HTMLElement
  const parent = el.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
  const sibling = document.getElementById(value.value)?.nextElementSibling?.querySelector('pre')
  if (!parent || !sibling) {
    return
  }
  const ignoredNodes = ['.vp-copy-ignore', '.diff.remove']
  // Clone the node and remove the ignored nodes
  const clone = sibling.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll(ignoredNodes.join(','))
    .forEach(node => node.remove())

  source.value = clone.textContent || ''
  copy(source.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <ClientOnly>
    <TabsRoot v-model="value" class="w-full mt-4">
      <div class="bg-#F4F4F5 dark:bg-#27272A flex pr-2 border border-black border-op-20 dark:border-white dark:border-op-20 border-b-0 rounded-t-md">
        <div class="flex justify-between items-center w-full text-[13px]">
          <TabsList
            class="relative flex items-center justify-between gap-1 overflow-hidden p-2"
          >
            <TabsTrigger
              v-for="tab in props.tabs"
              :key="tab.value"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-default"
              :value="tab.value"
            >
              <Icon :name="tab.icon" class="w-4 h-4" />
              <span class="ml-2">{{ tab.label }}</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <div class="flex">
          <Button class="mr-2 bg-transparent" @click="handleCopy">
            <Icon v-if="isCopied" name="carbon:checkmark" class="w-4 h-4 text-dark dark:text-light text-op-50! hover:text-op-100!" />
            <Icon v-else class="w-4 h-4 text-dark dark:text-light text-op-50! hover:text-op-100!" name="carbon:copy" />
          </Button>
        </div>
      </div>

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
