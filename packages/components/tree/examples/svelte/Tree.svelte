<script lang="ts">
  import * as tree from '../../index'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import { treeControls } from '@destyler/shared-private'
  import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
  import TreeNode from './TreeNode.svelte'
  import { createFileTreeCollection, defaultExpandedBranches } from '../data'
  import '../style.css'

  const controls = useControls(treeControls)
  const id = $props.id()
  const collection = createFileTreeCollection()

  const controlContext = $derived({
    dir: controls.context.dir,
    selectionMode: controls.context.selectionMode,
    expandOnClick: controls.context.openOnClick,
  })

  const [snapshot, send] = useMachine(
    tree.machine({
      id,
      collection,
      expandedValue: defaultExpandedBranches,
    }),
    {
      context: controlContext,
    },
  )

  const api = $derived(tree.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main class="tree-example">
    <section class="tree-example__card">
      <div class="tree-example__header">
        <h3 {...api.getLabelProps()}>Project files</h3>
        <span class="tree-example__meta">{api.expandedValue.length} open folders</span>
      </div>

      <div class="tree-example__actions">
        <button type="button" onclick={() => api.expand()}>Expand all</button>
        <button type="button" onclick={() => api.collapse()}>Collapse all</button>
        <button type="button" onclick={() => api.select()}>Select all</button>
        <button type="button" onclick={() => api.deselect()}>Clear selection</button>
      </div>

      <div {...api.getRootProps()}>
        <div {...api.getTreeProps()}>
          {#each api.collection.rootNode.children ?? [] as node, index}
            <TreeNode {node} indexPath={[index]} api={api} />
          {/each}
        </div>
      </div>
    </section>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} omit={['collection']} />
  </Toolbar>
</Layout>
