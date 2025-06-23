<script setup lang="ts">
import * as tree from "@destyler/tree"
import { normalizeProps, useMachine } from "@destyler/vue"
import { computed, useId } from "vue"
import TreeNode from "../components/TreeNode.vue"
import { treeControls } from '@destyler/shared-private'
import { useControls } from '../composables/useControls'

const controls = useControls(treeControls)
interface Node {
  id: string
  name: string
  children?: Node[]
}
const collection = tree.collection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: "ROOT",
    name: "",
    children: [
      {
        id: "node_modules",
        name: "node_modules",
        children: [
          { id: "node_modules/zag-js", name: "destyler" },
          { id: "node_modules/pandacss", name: "unocss" },
          {
            id: "node_modules/@types",
            name: "@types",
            children: [
              { id: "node_modules/@types/react", name: "react" },
              { id: "node_modules/@types/react-dom", name: "react-dom" },
            ],
          },
        ],
      },
    ],
  },
})
const [state, send] = useMachine(tree.machine({ id: useId(), collection }),{
  context: controls.context,
})
const api = computed(() => tree.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="tree">
    <div v-bind="api.getRootProps()">
      <h3 v-bind="api.getLabelProps()">My Documents</h3>
      <div v-bind="api.getTreeProps()">
        <TreeNode
          v-for="(node, index) in api.collection.rootNode.children"
          :key="node.id"
          :node="node"
          :index-path="[index]"
          :api="api"
        />
      </div>
    </div>
  </main>
  <Toolbar>
    <StateVisualizer :state="state" />
    <template #controls>
      <Controls :control="controls" />
    </template>
  </Toolbar>
</template>
