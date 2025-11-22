<script setup lang="ts">
import { treeControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as tree from '../../index'
import { createFileTreeCollection, defaultExpandedBranches } from '../data'
import TreeNode from './TreeNode.vue'
import '../style.css'

const controls = useControls(treeControls)
const collection = createFileTreeCollection()

const controlContext = computed(() => ({
  dir: controls.context.value.dir,
  selectionMode: controls.context.value.selectionMode,
  expandOnClick: controls.context.value.openOnClick,
}))

const [state, send] = useMachine(
  tree.machine({
    id: useId(),
    collection,
    expandedValue: defaultExpandedBranches,
  }),
  {
    context: controlContext,
  },
)

const api = computed(() => tree.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main class="tree-example">
      <section class="tree-example__card">
        <div class="tree-example__header">
          <h3 v-bind="api.getLabelProps()">
            Project files
          </h3>
          <span class="tree-example__meta">
            {{ api.expandedValue.length }} open folders
          </span>
        </div>

        <div class="tree-example__actions">
          <button type="button" @click="api.expand()">
            Expand all
          </button>
          <button type="button" @click="api.collapse()">
            Collapse all
          </button>
          <button type="button" @click="api.select()">
            Select all
          </button>
          <button type="button" @click="api.deselect()">
            Clear selection
          </button>
        </div>

        <div v-bind="api.getRootProps()">
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
      </section>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" :omit="['collection']" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
