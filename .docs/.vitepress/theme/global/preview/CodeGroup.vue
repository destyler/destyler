<script setup lang="ts">
import { type VNode, capitalize, computed, ref, useSlots, watch } from 'vue'
import { Button, Icon, SelectContent, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport, TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'destyler'
import { useClipboard, useElementSize, useVModel } from '@vueuse/core'

defineOptions({
  inheritAttrs: false,
})
const props = defineProps<{
  modelValue: 'css' | 'tailwind' | 'pinceau' | 'unocss'
}>()
const emits = defineEmits<{
  'update:modelValue': [payload: 'css' | 'tailwind' | 'pinceau' | 'unocss']
}>()

const tabList = ref()

const { height: tabListHeight } = useElementSize(tabList)

const cssFramework = useVModel(props, 'modelValue', emits)

const slots = useSlots()
const slotsFramework = computed(() => slots.default?.().map(slot => slot.props?.key?.toString()?.replace('_', '')) ?? [])

const cssFrameworkOptions = computed(() => [
  { label: 'UnoCSS', value: 'unocss' },
  { label: 'TailwindCSS', value: 'tailwind' },
  { label: 'CSS', value: 'css' },
  { label: 'Pinceau', value: 'pinceau' },
].filter(i => slotsFramework.value.includes(i.value)))

const tabs = computed(
  () => {
    const currentFramework = slots.default?.().find((slot) => {
      return slot.props?.key?.toString() === `_${cssFramework.value}`
    })

    const typeOrder = ['vue', 'ts', 'js', 'css']

    const childSlots = (currentFramework?.children as VNode[]).sort((a, b) => {
      const aType = a?.props?.title.split('.').pop()
      const bType = b?.props?.title.split('.').pop()
      const typeComparison = typeOrder.indexOf(aType) - typeOrder.indexOf(bType)

      if (typeComparison !== 0) {
        return typeComparison
      }
      return a?.props?.title.localeCompare(b?.props?.title)
    })

    return childSlots?.map((slot, index) => {
      return {
        label: slot.props?.title || `${index}`,
        component: slot,
      }
    }) || []
  },
)

const open = ref(false)

const codeScrollWrapper = ref<HTMLElement | undefined>()
const buttonRef = ref<HTMLElement | undefined>()
const currentTab = ref('index.vue')

watch(open, () => {
  if (!open.value) {
    codeScrollWrapper.value!.scrollTo({
      top: 0,
    })
  }
})

const isCopied = ref(false)

const source = ref('')

const { copy } = useClipboard({ source })
function handleCopy(e: any) {
  const el = e.target as HTMLElement
  const parent = el.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
  const sibling = document.getElementById(currentTab.value)?.nextElementSibling?.querySelector('pre')
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
    <TabsRoot
      id="code-group"
      v-model="currentTab"
      class="bg-[var(--at-code-bg)] border-solid border-#ededed dark:border-[#282828] rounded-b-lg overflow-hidden"
      @update:model-value="open = true"
    >
      <div class="bg-#F4F4F5 dark:bg-#27272A border-b-2 border-#e4e4e7 dark:border-#272727 flex pr-2">
        <div class="flex justify-between items-center w-full text-[13px]">
          <TabsList ref="tabList" class="flex relative">
            <TabsIndicator
              class="absolute bg-primary left-0 h-[2px] top-1 w-[--destyler-tabs-indicator-size] translate-x-[--destyler-tabs-indicator-position] rounded-full  transition-[width,transform] duration-300"
              :style="{ top: `${tabListHeight}px` }"
            />
            <TabsTrigger
              v-for="(tab, index) in tabs"
              :key="index"
              :value="tab.label"
              tabindex="-1"
              class="flex justify-center items-center text-black/70 dark:text-white/70 py-2.5 px-4 border-box data-[state=active]:font-medium data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              <FileIcones :name="tab.label" class="mr-2 w-5 h-5" />
              {{ tab.label }}
            </TabsTrigger>
          </TabsList>
          <div class="flex">
            <Button class="mr-2 bg-transparent" @click="handleCopy">
              <Icon v-if="isCopied" name="carbon:checkmark" class="w-4 h-4 text-dark dark:text-light text-op-50! hover:text-op-100!" />
              <Icon v-else class="w-4 h-4 text-dark dark:text-light text-op-50! hover:text-op-100!" name="carbon:copy" />
            </Button>
            <SelectRoot v-model="cssFramework" @update:model-value="currentTab = 'index.vue'">
              <SelectTrigger class="text-black dark:text-white flex items-center justify-between bg-light dark:bg-dark border border-black border-op-20 dark:border-white dark:border-op-20 rounded-md w-[115px] text-xs py-1 pl-2 pr-1">
                <SelectValue />
                <Icon name="radix-icons:chevron-down" class="h-3.5 w-3.5" />
              </SelectTrigger>

              <SelectPortal>
                <SelectContent class="border border-#ededed dark:border-[#282828] min-w-[115px] bg-#f8f8f8 dark:bg-#1c1c1c rounded will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100]">
                  <SelectViewport class="p-[5px]">
                    <SelectItem
                      v-for="framework in cssFrameworkOptions"
                      :key="framework.label"
                      class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pl-[25px] relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-#27272a data-[highlighted]:text-#f4f4f5 dark:data-[highlighted]:bg-white dark:data-[highlighted]:text-black"
                      :value="framework.value"
                    >
                      <SelectItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                        <Icon name="radix-icons:check" />
                      </SelectItemIndicator>

                      <SelectItemText>
                        {{ capitalize(framework.label ?? '') }}
                      </SelectItemText>
                    </SelectItem>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
          </div>
        </div>
      </div>
      <div
        ref="codeScrollWrapper"
        :key="cssFramework"
        class="pb-10 block custom scrollbar-hide"
        :class="`${open ? 'overflow-scroll h-full min-h-[150px] max-h-[80vh]' : 'overflow-hidden h-[150px]'}`"
      >
        <TabsContent v-for="tab in tabs" :key="tab.label" :value="tab.label" as-child>
          <div class="relative text-base">
            <component :is="tab.component" class="border-0 scrollbar-hide" />
          </div>
        </TabsContent>
        <div
          class="bg-gradient-to-t from-[#f8f8f8FF] to-[#16161800] dark:bg-gradient-to-t dark:from-[#161618FF] dark:to-[#16161800] bottom-[-1px] left-[1px] right-[1px] h-20 flex items-center justify-center absolute rounded-b-lg"
        >
          <button
            ref="buttonRef"
            class="mt-4 text-dark dark:text-light bg-#f8f8f8 dark:bg-#1c1c1c hover:bg-#f4f4f5 dark:hover:bg-#27272a px-3 py-1 rounded-md border-##e4e4e7 dark:border-[#282828] border"
            @click="open = !open"
          >
            {{ open ? "Collapse code" : "Expand code" }}
          </button>
        </div>
      </div>
    </TabsRoot>
  </ClientOnly>
</template>

<style scoped>
</style>
