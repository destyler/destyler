import type { Api } from '@destyler/tree'
import { useMemo } from 'react'

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

export function TreeNode({ node, indexPath, api }: Props) {
  const nodeProps = useMemo(() => ({
    indexPath,
    node,
  }), [indexPath, node])

  const nodeState = useMemo(() => api.getNodeState(nodeProps), [api, nodeProps])

  if (nodeState.isBranch) {
    return (
      <div {...api.getBranchProps(nodeProps)}>
        <div {...api.getBranchControlProps(nodeProps)}>
          <span {...api.getBranchTextProps(nodeProps)}>{node.name}</span>
          <span {...api.getBranchIndicatorProps(nodeProps)} />
        </div>
        <div {...api.getBranchContentProps(nodeProps)}>
          <div {...api.getBranchIndentGuideProps(nodeProps)} />
          {node.children?.map((childNode, index) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              indexPath={[...indexPath, index]}
              api={api}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div {...api.getItemProps(nodeProps)}>{node.name}</div>
  )
}
