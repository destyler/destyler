<script setup lang="ts">
import type { CSSFramework } from '../../stores/style';
import * as select from '@destyler/select'
import * as tabs from '@destyler/tabs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { useStore } from '@nanostores/vue'
import { computed, onMounted, ref, useId, watch } from 'vue'
import { $framework } from '../../stores/framework'
import { $style, styleFrameworkData } from '../../stores/style'

const props = defineProps<{
  files: CodeFiles
}>()

const store = useStore($framework)

const styleStore = useStore($style)

interface CodeFile {
  title: string
  content?: string
  highlighted?: string
  language?: string
}

interface CodeFiles {
  [framework: string]: {
    [style: string]: {
      config: CodeFile | null
      code: CodeFile[]
    }
  }
}

const currentFramework = computed(() => store.value || 'vue')

const currentStyleRef = computed(() => styleStore.value || 'unocss')
const currentStyle = computed(() => currentStyleRef.value)
const currentSelectedFile = ref('0')

const isCopied = ref(false)
const copyTimeout = ref<number | null>(null)

function copyCode(code: string) {
  if (navigator.clipboard) {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = code
    const textContent = tempElement.textContent || tempElement.textContent || ''

    navigator.clipboard.writeText(textContent).then(() => {
      isCopied.value = true

      if (copyTimeout.value)
        clearTimeout(copyTimeout.value)
      copyTimeout.value = setTimeout(() => {
        isCopied.value = false
      }, 3000) as unknown as number
    })
  }
}

const [state, send] = useMachine(tabs.machine({
  id: useId(),
  value: '0',
}))

const api = computed(() => tabs.connect(state.value, send, normalizeProps))

const [styleState, styleSend] = useMachine(
  select.machine({
    id: useId(),
    collection: select.collection({
      items: styleFrameworkData,
    }),
    value: [currentStyle.value],
  }),
)

const styleApi = computed(() => select.connect(styleState.value, styleSend, normalizeProps))

const fileData = computed(() => {
  const data: any[] = []
  const framework = currentFramework.value
  const style = currentStyle.value

  if (!props.files[framework] || !props.files[framework][style])
    return data

  const content = props.files[framework][style]

  if (!content)
    return data

  const filesByType: Record<string, any[]> = {}

  if (Array.isArray(content.code)) {
    content.code.forEach((file, index) => {
      const fileExt = file.title.split('.').pop() || 'other'

      if (!filesByType[fileExt]) {
        filesByType[fileExt] = []
      }

      filesByType[fileExt].push({
        value: `${index}`,
        label: file.title,
        content: file.highlighted || file.content,
        language: file.language,
        type: fileExt,
      })
    })
  }

  const fileTypeOrder = [
    'vue',
    'jsx',
    'tsx',
    'svelte',
    'js',
    'ts',
    'css',
    'scss',
    'less',
    'sass',
    'other',
  ]

  fileTypeOrder.forEach((typeExt) => {
    if (filesByType[typeExt]) {
      const sortedFiles = filesByType[typeExt].sort((a, b) =>
        a.label.localeCompare(b.label),
      )

      sortedFiles.forEach((file) => {
        data.push(file)
      })
    }
  })

  Object.keys(filesByType)
    .filter(type => !fileTypeOrder.includes(type))
    .sort()
    .forEach((type) => {
      filesByType[type].sort((a, b) =>
        a.label.localeCompare(b.label),
      ).forEach((file) => {
        data.push(file)
      })
    })

  if (content.config) {
    data.push({
      value: `config`,
      label: content.config.title,
      content: content.config.highlighted || content.config.content,
      language: content.config.language,
      type: 'config',
    })
  }

  return data
})

watch(() => api.value.value, (newValue) => {
  if (newValue) {
    currentSelectedFile.value = newValue
  }
})

watch(() => styleApi.value.value, (newValue) => {
  if (newValue) {
    $style.set(newValue[0] as CSSFramework)
    currentSelectedFile.value = '0'
    api.value.setValue('0')
  }
})

onMounted(() => {
  styleApi.value.setValue([currentStyleRef.value])
})
</script>

<template>
  <div class="flex flex-col">
    <div v-bind="api.getRootProps()" class="w-full">
      <div
        v-bind="api.getListProps()"
        class="flex h-10 w-full items-center justify-between gap-1 bg-muted p-1.5 text-muted-foreground overflow-hidden"
        role="tablist"
      >
        <div class="flex overflow-x-auto scrollbar-hide mt-0!">
          <button
            v-for="file in fileData"
            :key="file.value"
            v-bind="api.getTriggerProps({ value: file.value })"
            class="relative inline-flex mt-0! items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all hover:text-foreground data-[selected]:text-foreground data-[selected]:bg-background/50 rounded"
          >
            <div class="flex items-center gap-1 mt-0!">
              <span v-if="file.language === 'vue'" class="i-logos:vue w-3 h-3" />
              <span v-else-if="file.language === 'jsx'" class="i-logos:react w-3 h-3" />
              <span v-else-if="file.language === 'tsx'" class="i-logos:react w-3 h-3" />
              <span v-else-if="file.language === 'css'" class="i-logos:css-3 w-3 h-3" />
              <span v-else-if="file.language === 'js'" class="i-logos:javascript w-3 h-3" />
              <span v-else-if="file.language === 'ts'" class="i-logos:typescript-icon w-3 h-3" />
              <span v-else-if="file.language === 'svelte'" class="i-logos:svelte-icon w-3 h-3" />
              <span v-else class="i-carbon:document w-3 h-3" />
              {{ file.label }}
            </div>
          </button>
        </div>

        <div class="relative w-32 mt-0!">
          <button
            v-bind="styleApi.getTriggerProps()"
            class="group flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div class="flex items-center gap-2">
              <span :class="styleApi.selectedItems[0]?.icon" class="w-4 h-4" />
              <span class="text-foreground">{{ styleApi.valueAsString || "Select" }}</span>
            </div>
            <span class="i-carbon:chevron-down transition-transform duration-300 group-data-[state=open]:rotate--180 w-4 h-4 text-muted-foreground" />
          </button>

          <Teleport v-if="styleApi.open" to="body">
            <div v-bind="styleApi.getPositionerProps()" class="relative z-50! min-w-[8rem] w-[--reference-width]">
              <ul v-bind="styleApi.getContentProps()" class="absolute w-full rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
                <li
                  v-for="item in styleFrameworkData"
                  :key="item.value"
                  v-bind="styleApi.getItemProps({ item })"
                  class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="flex items-center gap-2">
                    <span :class="item.icon" class="w-4 h-4" />
                    <span>{{ item.label }}</span>
                  </div>
                  <span v-bind="styleApi.getItemIndicatorProps({ item })" class="ml-auto pl-2 text-primary">
                    <span class="i-lucide:check w-4 h-4" />
                  </span>
                </li>
              </ul>
            </div>
          </Teleport>
        </div>
      </div>

      <div
        v-for="file in fileData"
        :key="file.value"
        v-bind="api.getContentProps({ value: file.value })"
        class="relative mt-0!"
      >
        <div class="absolute mt-0! right-2 top-2 z-10">
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 bg-primary/10 hover:bg-primary/20 transition-colors"
            :aria-label="isCopied ? '已复制' : '复制代码'"
            @click="copyCode(file.content)"
          >
            <span v-if="isCopied" class="i-carbon:checkmark w-4 h-4 text-green-500" />
            <span v-else class="i-carbon:copy w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div class="code-container mt-0!" v-html="file.content" />
      </div>
    </div>
  </div>
</template>

<style>
.code-container .shiki {
  max-height: min(500px, 60vh);
  overflow-y: auto;
  border-top-right-radius: 0px !important;
  border-top-left-radius: 0px !important;
  border-bottom-right-radius: var(--radius) !important;
  border-bottom-left-radius: var(--radius) !important;
  border-top-style: none !important;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb, rgba(120, 120, 120, 0.4)) transparent;
}

.code-container .shiki::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.code-container .shiki::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb, rgba(120, 120, 120, 0.4));
  border-radius: 3px;
}

.code-container .shiki::-webkit-scrollbar-track {
  background: transparent;
}

html.dark .code-container .shiki {
  --scrollbar-thumb: rgba(150, 150, 150, 0.3);
}

html.dark .code-container .shiki span {
  color: var(--shiki-dark) !important;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 高亮代码行 */
.shiki .line:hover {
  background-color: rgba(125, 125, 125, 0.1);
}

/* 复制按钮效果 */
.code-container {
  position: relative;
}

/* 文件类型分组样式 */
.file-group-label {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-right: 0.5rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background-color: var(--muted);
}
</style>
