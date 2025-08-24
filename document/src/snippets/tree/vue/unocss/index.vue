<script setup lang="ts">
import * as tree from '@destyler/tree'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import TreeNode from './Node.vue'

interface Node {
  id: string
  name: string
  children?: Node[]
}
const collection = tree.collection<Node>({
  nodeToValue: node => node.id,
  nodeToString: node => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'src',
        name: 'src',
        children: [
          {
            id: 'src/components',
            name: 'components',
            children: [
              { id: 'src/components/Button.vue', name: 'Button.vue' },
              { id: 'src/components/Layout.vue', name: 'Layout.vue' },
            ],
          },
          {
            id: 'src/pages',
            name: 'pages',
            children: [
              { id: 'src/pages/index.vue', name: 'index.vue' },
              { id: 'src/pages/about.vue', name: 'about.vue' },
            ],
          },
          {
            id: 'src/snippets',
            name: 'snippets',
            children: [
              {
                id: 'src/snippets/tree',
                name: 'tree',
                children: [
                  { id: 'src/snippets/tree/Tree.vue', name: 'Tree.vue' },
                  { id: 'src/snippets/tree/TreeNode.vue', name: 'TreeNode.vue' },
                ],
              },
            ],
          },
          { id: 'src/App.vue', name: 'App.vue' },
          { id: 'src/main.ts', name: 'main.ts' },
          { id: 'src/style.css', name: 'style.css' },
        ],
      },
      {
        id: 'public',
        name: 'public',
        children: [
          { id: 'public/favicon.ico', name: 'favicon.ico' },
          { id: 'public/logo.svg', name: 'logo.svg' },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'vite.config.ts', name: 'vite.config.ts' },
      { id: 'tsconfig.json', name: 'tsconfig.json' },
      { id: 'unocss.config.ts', name: 'unocss.config.ts' },
      { id: 'README.md', name: 'README.md' },
    ],
  },
})
const [state, send] = useMachine(tree.machine({
  id: useId(),
  collection,
  expandedValue: ['src'],
}))
const api = computed(() => tree.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="relative max-w-300px rounded-2xl border border-border/40 bg-card p-2 text-card-foreground shadow-xl shadow-black/8 mt-0!">
    
    <!-- 树形结构 -->
    <div v-bind="api.getRootProps()" class="w-full mt-0!">
      <div v-bind="api.getTreeProps()" class="space-y-1 mt-0!">
        <TreeNode
          v-for="(node, index) in api.collection.rootNode.children"
          :key="node.id"
          :node="node"
          :index-path="[index]"
          :api="api"
          class="mt-0!"
        />
      </div>
    </div>
    
  </main>
</template>
