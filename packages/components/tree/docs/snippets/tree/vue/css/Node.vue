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

const getFileIcon = (fileName: string) => {
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

const getFolderIcon = (folderName: string) => {
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
    <div v-bind="api.getBranchProps(nodeProps)" class="tree-branch">
      <div
        v-bind="api.getBranchControlProps(nodeProps)"
        class="tree-branch-control"
      >
        <span
          v-bind="api.getBranchIndicatorProps(nodeProps)"
          class="tree-branch-indicator"
        >
          <div 
            :class="{ 'expanded': nodeState.expanded }" 
            class="tree-chevron i-carbon-chevron-right"
          />
        </span>
        <div class="tree-icon-container">
          <div 
            :class="[
              getFolderIcon(node.name)
            ]"
            class="tree-icon"
          />
        </div>
        <span 
          v-bind="api.getBranchTextProps(nodeProps)" 
          class="tree-branch-text"
        >
          {{ node.name }}
        </span>
      </div>
      <div
        v-if="nodeState.expanded"
        v-bind="api.getBranchContentProps(nodeProps)"
        class="tree-branch-content space-y-1"
      >
        <TreeNode
          v-for="(childNode, index) in node.children"
          :key="childNode.id"
          :node="childNode"
          :index-path="[...indexPath, index]"
          :api="api"
          class="tree-node"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <div
      v-bind="api.getItemProps(nodeProps)"
      class="tree-item"
    >
      <div class="tree-item-spacer" />
      <div class="tree-file-icon-container">
        <div 
          :class="getFileIcon(node.name)"
          class="tree-file-icon"
        />
      </div>
      <span class="tree-item-text">
        {{ node.name }}
      </span>
    </div>
  </template>
</template>
