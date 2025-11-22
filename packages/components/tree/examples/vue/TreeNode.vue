<script setup lang="ts">
import type { Api } from '../../index'
import type { FileNode } from '../data'
import { computed } from 'vue'

defineOptions({ name: 'TreeNode' })

const props = defineProps<{ node: FileNode, indexPath: number[], api: Api }>()

const nodeProps = computed(() => ({
  node: props.node,
  indexPath: props.indexPath,
}))

const nodeState = computed(() => props.api.getNodeState(nodeProps.value))
const childCount = computed(() => props.node.children?.length ?? 0)
</script>

<template>
  <template v-if="nodeState.isBranch">
    <div v-bind="api.getBranchProps(nodeProps)">
      <div v-bind="api.getBranchControlProps(nodeProps)">
        <span v-bind="api.getBranchIndicatorProps(nodeProps)" />
        <span v-bind="api.getBranchTextProps(nodeProps)">{{ node.name }}</span>
        <span class="tree-example__meta">{{ childCount }} items</span>
      </div>
      <div
        v-if="nodeState.expanded"
        v-bind="api.getBranchContentProps(nodeProps)"
      >
        <div v-bind="api.getBranchIndentGuideProps(nodeProps)" />
        <TreeNode
          v-for="(childNode, index) in node.children ?? []"
          :key="childNode.id"
          :node="childNode"
          :index-path="[...indexPath, index]"
          :api="api"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <div v-bind="api.getItemProps(nodeProps)">
      <span v-bind="api.getItemIndicatorProps(nodeProps)" />
      <span v-bind="api.getItemTextProps(nodeProps)">{{ node.name }}</span>
    </div>
  </template>
</template>
