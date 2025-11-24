import type { Api } from '../../index'
import type { FileNode } from '../data'
import { useMemo } from 'react'

interface TreeNodeProps {
  node: FileNode
  indexPath: number[]
  api: Api
}

export default function TreeNode({ node, indexPath, api }: TreeNodeProps) {
  const nodeProps = useMemo(() => ({ node, indexPath }), [node, indexPath])
  const nodeState = api.getNodeState(nodeProps)

  if (nodeState.isBranch) {
    const childCount = node.children?.length ?? 0
    return (
      <div {...api.getBranchProps(nodeProps)}>
        <div {...api.getBranchControlProps(nodeProps)}>
          <span {...api.getBranchIndicatorProps(nodeProps)} />
          <span {...api.getBranchTextProps(nodeProps)}>{node.name}</span>
          <span className="tree-example__meta">
            {childCount}
            {' '}
            items
          </span>
        </div>
        {nodeState.expanded && (
          <div {...api.getBranchContentProps(nodeProps)}>
            <div {...api.getBranchIndentGuideProps(nodeProps)} />
            {node.children?.map((childNode, childIndex) => (
              <TreeNode
                key={childNode.id}
                node={childNode}
                indexPath={[...indexPath, childIndex]}
                api={api}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div {...api.getItemProps(nodeProps)}>
      <span {...api.getItemIndicatorProps(nodeProps)} />
      <span {...api.getItemTextProps(nodeProps)}>{node.name}</span>
    </div>
  )
}
