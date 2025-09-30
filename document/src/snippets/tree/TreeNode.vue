<script setup lang="ts">
import type { Api } from '@destyler/tree'
import { computed } from 'vue'

interface Node {
  id: string
  name: string
  children?: Node[]
}

interface Props {
  node: Node
  indexPath: number[]
  api: Api
}

const props = defineProps<Props>()

const nodeProps = computed(() => ({
  indexPath: props.indexPath,
  node: props.node,
}))

const nodeState = computed(() => props.api.getNodeState(nodeProps.value))

function getFileIcon (fileName: string) {
  // Vue 文件
  if (fileName.endsWith('.vue')) return 'i-catppuccin-vue'

  // 配置文件
  if (fileName === 'package.json') return 'i-catppuccin-package-json'
  if (fileName.includes('tsconfig')) return 'i-catppuccin-typescript-config'
  if (fileName.includes('vite.config')) return 'i-catppuccin-vite'
  if (fileName.includes('unocss.config')) return 'i-catppuccin-unocss'

  // TypeScript/JavaScript 文件
  if (fileName.endsWith('.ts')) return 'i-catppuccin-typescript'
  if (fileName.endsWith('.js')) return 'i-catppuccin-javascript'

  // 样式文件
  if (fileName.endsWith('.css')) return 'i-catppuccin-css'

  // 图片文件
  if (fileName.endsWith('.svg')) return 'i-catppuccin-image'
  if (fileName.endsWith('.ico')) return 'i-catppuccin-image'
  if (fileName.match(/\.(png|jpg|jpeg|gif|webp)$/)) return 'i-catppuccin-image'

  // 文档文件
  if (fileName.endsWith('.md')) return 'i-catppuccin-markdown-mdx'
  if (fileName.endsWith('.txt')) return 'i-catppuccin-text'

  // 默认文件图标
  return 'i-catppuccin-file'
}

function getFolderIcon (folderName: string) {
  if (folderName === 'components') return 'i-catppuccin-folder-components'
  if (folderName === 'pages') return 'i-catppuccin-folder-packages'
  if (folderName === 'public') return 'i-catppuccin-folder-assets'
  if (folderName === 'src') return 'i-catppuccin-folder-src'
  if (folderName === 'ui') return 'i-catppuccin-folder-themes'
  if (folderName === 'layout') return 'i-catppuccin-folder-layouts'
  if (folderName === 'snippets') return 'i-catppuccin-folder-templates'
  return 'i-catppuccin-folder'
}
</script>

<template>
  <template v-if="nodeState.isBranch">
    <div v-bind="api.getBranchProps(nodeProps)" class="mt-0!">
      <div
        v-bind="api.getBranchControlProps(nodeProps)"
        class="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer select-none mt-0!"
      >
        <span
          v-bind="api.getBranchIndicatorProps(nodeProps)"
          class="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground/80 mt-0!"
        >
          <div
            :class="{ 'rotate-90': nodeState.expanded }"
            class="i-carbon-chevron-right h-3.5 w-3.5 mt-0!"
          />
        </span>
        <div class="flex h-5 w-5 shrink-0 items-center justify-center mt-0!">
          <div
            :class="[
              getFolderIcon(node.name),
            ]"
            class="h-4 w-4 mt-0!"
          />
        </div>
        <span
          v-bind="api.getBranchTextProps(nodeProps)"
          class="text-foreground/95 font-medium mt-0!"
        >
          {{ node.name }}
        </span>
      </div>
      <div
        v-if="nodeState.expanded"
        v-bind="api.getBranchContentProps(nodeProps)"
        class="mt-0! space-y-1 border-l-2 border-border/30 pl-4"
      >
        <TreeNode
          v-for="(childNode, index) in node.children"
          :key="childNode.id"
          :node="childNode"
          :index-path="[...indexPath, index]"
          :api="api"
          class="mt-0!"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <div
      v-bind="api.getItemProps(nodeProps)"
      class="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer select-none mt-0!"
    >
      <div class="h-4 w-4 shrink-0 mt-0!" />
      <div class="flex h-4 w-4 shrink-0 items-center justify-center mt-0!">
        <div
          :class="getFileIcon(node.name)"
          class="h-3.5 w-3.5 mt-0!"
        />
      </div>
      <span class="text-muted-foreground/80 mt-0!">
        {{ node.name }}
      </span>
    </div>
  </template>
</template>
