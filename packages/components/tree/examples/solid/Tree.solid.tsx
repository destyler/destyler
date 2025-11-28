/** @jsxImportSource solid-js */
import type { FileNode } from '../data'
import { treeControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { For } from 'solid-js/web'
import * as tree from '../../index'
import { createFileTreeCollection, defaultExpandedBranches } from '../data'
import TreeNode from './TreeNode.solid'
import '../style.css'

export default function TreeExample() {
  const controls = useControls(treeControls)

  const collection = createMemo(() => createFileTreeCollection())

  const controlContext = createMemo(() => ({
    dir: controls.context().dir,
    selectionMode: controls.context().selectionMode,
    expandOnClick: controls.context().openOnClick,
  }))

  const [state, send] = useMachine(
    tree.machine({
      id: createUniqueId(),
      collection: collection(),
      expandedValue: defaultExpandedBranches,
    }),
    {
      context: controlContext,
    },
  )

  const api = createMemo(() => tree.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main class="tree-example">
        <section class="tree-example__card">
          <div class="tree-example__header">
            <h3 {...api().getLabelProps()}>Project files</h3>
            <span class="tree-example__meta">
              {api().expandedValue.length}
              {' '}
              open folders
            </span>
          </div>

          <div class="tree-example__actions">
            <button type="button" onClick={() => api().expand()}>Expand all</button>
            <button type="button" onClick={() => api().collapse()}>Collapse all</button>
            <button type="button" onClick={() => api().select()}>Select all</button>
            <button type="button" onClick={() => api().deselect()}>Clear selection</button>
          </div>

          <div {...api().getRootProps()}>
            <div {...api().getTreeProps()}>
              <For each={(api().collection.rootNode.children as FileNode[] | undefined) ?? []}>
                {(node, index) => (
                  <TreeNode node={node} indexPath={[index()]} api={api()} />
                )}
              </For>
            </div>
          </div>
        </section>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} omit={['collection']} />
      </Toolbar>
    </Layout>
  )
}
