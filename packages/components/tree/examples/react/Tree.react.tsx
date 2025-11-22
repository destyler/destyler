import type { FileNode } from '../data'
import { normalizeProps, useMachine } from '@destyler/react'
import { treeControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId, useMemo } from 'react'
import * as tree from '../../index'
import { createFileTreeCollection, defaultExpandedBranches } from '../data'
import TreeNode from './TreeNode.react'
import '../style.css'

export default function TreeExample() {
  const controls = useControls(treeControls)
  const collection = useMemo(() => createFileTreeCollection(), [])

  const { dir, selectionMode, openOnClick } = controls.context

  const controlContext = useMemo(
    () => ({
      dir,
      selectionMode,
      expandOnClick: openOnClick,
    }),
    [dir, selectionMode, openOnClick],
  )

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

  const api = tree.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main className="tree-example">
        <section className="tree-example__card">
          <div className="tree-example__header">
            <h3 {...api.getLabelProps()}>Project files</h3>
            <span className="tree-example__meta">
{api.expandedValue.length}
{' '}
open folders
</span>
          </div>

          <div className="tree-example__actions">
            <button type="button" onClick={() => api.expand()}>Expand all</button>
            <button type="button" onClick={() => api.collapse()}>Collapse all</button>
            <button type="button" onClick={() => api.select()}>Select all</button>
            <button type="button" onClick={() => api.deselect()}>Clear selection</button>
          </div>

          <div {...api.getRootProps()}>
            <div {...api.getTreeProps()}>
              {api.collection.rootNode.children?.map((node: FileNode, index: number) => (
                <TreeNode key={node.id} node={node} indexPath={[index]} api={api} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} omit={['collection']} />
      </Toolbar>
    </Layout>
  )
}
