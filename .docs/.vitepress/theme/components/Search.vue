<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxViewport,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
  Icon,
} from 'destyler'
import { computed, ref, watch } from 'vue'
import { useData, useRouter } from 'vitepress'
import { useElementSize } from '@vueuse/core'

const { site } = useData()

const router = useRouter()

const dialogStatus = ref<boolean>(false)
const model = ref<string>('')

const box = ref<any>()

const input = ref<any>()

const { height: boxHeight } = useElementSize(box)
const { height: inputHeight } = useElementSize(input)

onMounted(() => {
  const handleSearchHotKey = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      dialogStatus.value = !dialogStatus.value
    }
  }
  const remove = () => {
    window.removeEventListener('keydown', handleSearchHotKey)
  }
  window.addEventListener('keydown', handleSearchHotKey)
  onUnmounted(remove)
})

watch(dialogStatus, (value) => {
  if (!value) {
    model.value = ''
    document.body.style.overflow = 'auto'
  }
  else {
    document.body.style.overflow = 'hidden'
  }
})

const sidebar = computed(() => {
  const result: any[] = []
  Object.keys(site.value.themeConfig?.sidebar).forEach((item: string) => {
    result.push(...site.value.themeConfig?.sidebar[item])
  })
  return result
})

function handleGo(path: string) {
  new Promise((resolve) => {
    model.value = ''
    dialogStatus.value = false
    resolve({})
  }).then(() => {
    router.go(path)
  })
}
</script>

<template>
  <DialogRoot v-model:open="dialogStatus">
    <DialogTrigger class="head-btn">
      <Icon name="carbon:search" class="w-5 h-5" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="
        fixed inset-0 z-99 h-screen w-screen overflow-hidden bg-white/50 dark:bg-black/50
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        "
      />
      <DialogContent
        class="
        fixed left-50% top-50%
        z-200 grid w-full sm:max-w-3xl h-dvh sm:h-[28rem]
        translate-x--50% translate-y--50%
        gap-4 border sm:rounded-lg
        bg-white dark:bg-black
        border-border
        shadow-lg duration-200
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[state=closed]:slide-out-to-left-50%
        data-[state=closed]:slide-out-to-top-48%
        data-[state=open]:slide-in-from-left-50%
        data-[state=open]:slide-in-from-top-48%
        "
      >
        <div ref="box" class="flex flex-col min-h-full space-y-1.5 text-center sm:text-left h-full">
          <ComboboxRoot v-model="model" :default-open="true" class="relative h-full">
            <!-- input -->
            <ComboboxAnchor ref="input" class="relative flex items-center">
              <Icon name="carbon:search" class="pointer-events-none absolute start-4 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <ComboboxInput
                auto-focus
                class="w-full placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none sm:text-sm h-[--header-height] sm:h-12 px-4 ps-11 pe-10"
                placeholder="Placeholder..."
              />
              <DialogClose
                class="
                focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed
                disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75
                flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5
                hover:bg-accent hover:text-accent-foreground
                focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500
                dark:focus-visible:ring-primary-400 inline-flex items-center absolute end-4"
              >
                <Icon name="carbon:close" class="flex-shrink-0 h-5 w-5" />
              </DialogClose>
            </ComboboxAnchor>
            <!-- content -->
            <ComboboxViewport :style="{ height: `${boxHeight - inputHeight}px` }" class="relative flex-1 h-xs overflow-y-scroll border-t border-border">
              <ComboboxContent class="">
                <ComboboxEmpty
                  class="flex flex-col h-full w-full items-center justify-center flex-1 px-6 py-14 sm:px-14"
                >
                  <Icon name="carbon:search" class="w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <p class="text-sm text-center text-gray-900 dark:text-white">
                    We couldn't find any items with that term. Please try again.
                  </p>
                </ComboboxEmpty>
                <ComboboxGroup v-for="item in sidebar" :key="item.text" class="p-2">
                  <ComboboxLabel class="px-2.5 my-2 text-xs text-start font-semibold text-gray-900 dark:text-white">
                    {{ item.text }}
                  </ComboboxLabel>
                  <div class="text-sm text-gray-700 dark:text-gray-200">
                    <ComboboxItem
                      v-for="sub in item.items"
                      :key="sub.link"
                      :value="sub.text"
                      class="
                      flex justify-between select-none items-center rounded-md
                      px-2.5 py-1.5 gap-2 relative cursor-pointer
                      data-[highlighted]:bg-accent
                      "
                      @click="handleGo(sub.link)"
                    >
                      <div class="flex items-center gap-1.5 min-w-0">
                        <Icon :name="sub.rel ?? 'clarity:file-line'" class="flex-shrink-0 w-5 h-5" />
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span class="truncate">{{ sub.text }}</span>
                        </div>
                      </div>
                    </ComboboxItem>
                  </div>
                </ComboboxGroup>
              </ComboboxContent>
            </ComboboxViewport>
          </ComboboxRoot>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
