import type { Api } from '@destyler/tree'
import { createMemo, For } from 'solid-js'

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

export function TreeNode(props: Props) {
  const nodeProps = createMemo(() => ({
    indexPath: props.indexPath,
    node: props.node,
  }))

  const nodeState = createMemo(() => props.api.getNodeState(nodeProps()))

  return (
    <>
      {createMemo(() => nodeState().isBranch)()
        ? (
            <div {...props.api.getBranchProps(nodeProps())}>
              <div {...props.api.getBranchControlProps(nodeProps())}>
                <span {...props.api.getBranchTextProps(nodeProps())}>{props.node.name}</span>
                <span {...props.api.getBranchIndicatorProps(nodeProps())} />
              </div>
              <div {...props.api.getBranchContentProps(nodeProps())}>
                <div {...props.api.getBranchIndentGuideProps(nodeProps())} />
                <For each={props.node.children}>
                  {(childNode, index) => (
                    <TreeNode
                      node={childNode}
                      indexPath={[...props.indexPath, index()]}
                      api={props.api}
                    />
                  )}
                </For>
              </div>
            </div>
          )
        : (
            <div {...props.api.getItemProps(nodeProps())}>{props.node.name}</div>
          )}
    </>
  )
}
