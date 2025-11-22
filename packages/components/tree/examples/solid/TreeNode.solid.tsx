/** @jsxImportSource solid-js */
import type { FileNode } from '../data'
import type { Api } from '../../index'
import { For, Show, createMemo } from 'solid-js'

interface TreeNodeProps {
  node: FileNode
  indexPath: number[]
  api: Api
}

export default function TreeNode(props: TreeNodeProps) {
  const nodeProps = createMemo(() => ({ node: props.node, indexPath: props.indexPath }))
  const nodeState = createMemo(() => props.api.getNodeState(nodeProps()))

  return (
    <Show
      when={nodeState().isBranch}
      fallback={(
        <div {...props.api.getItemProps(nodeProps())}>
          <span {...props.api.getItemIndicatorProps(nodeProps())} />
          <span {...props.api.getItemTextProps(nodeProps())}>{props.node.name}</span>
        </div>
      )}
    >
      <div {...props.api.getBranchProps(nodeProps())}>
        <div {...props.api.getBranchControlProps(nodeProps())}>
          <span {...props.api.getBranchIndicatorProps(nodeProps())} />
          <span {...props.api.getBranchTextProps(nodeProps())}>{props.node.name}</span>
          <span class="tree-example__meta">{props.node.children?.length ?? 0} items</span>
        </div>
        <Show when={nodeState().expanded}>
          <div {...props.api.getBranchContentProps(nodeProps())}>
            <div {...props.api.getBranchIndentGuideProps(nodeProps())} />
            <For each={props.node.children ?? []}>
              {(child, index) => (
                <TreeNode node={child} indexPath={[...props.indexPath, index()]} api={props.api} />
              )}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  )
}
