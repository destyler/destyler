import type { Api } from '@destyler/tree'
import { useMemo } from 'react'

interface Node {
  id: string
  name: string
  children?: Node[]
}

interface TreeNodeProps {
  node: Node
  indexPath: number[]
  api: Api
}

export default function TreeNode({ node, indexPath, api }: TreeNodeProps) {
  const nodeProps = useMemo(() => ({
    indexPath,
    node,
  }), [indexPath, node])

  const nodeState = useMemo(() => api.getNodeState(nodeProps), [api, nodeProps])

  const getFileIcon = (fileName: string) => {
    // Vue 文件
    if (fileName.endsWith('.tsx')) return 'i-catppuccin-typescript-react'

    // 配置文件
    if (fileName === 'package.json') return 'i-catppuccin-package-json'
    if (fileName.includes('tsconfig')) return 'i-catppuccin-typescript-config'
    if (fileName.includes('vite.config')) return 'i-catppuccin-vite'
    if (fileName.includes('unocss.config')) return 'i-catppuccin-unocss'

    // TypeScript/JavaScript 文件
    if (fileName.endsWith('.ts')) return 'i-catppuccin-typescript'
    if (fileName.endsWith('.js')) return 'i-catppuccin-javascript'
    
    // 样式文件
    if (fileName.endsWith('.css')) return 'i-catppuccin-css'
    
    // 图片文件
    if (fileName.endsWith('.svg')) return 'i-catppuccin-image'
    if (fileName.endsWith('.ico')) return 'i-catppuccin-image'
    if (fileName.match(/\.(png|jpg|jpeg|gif|webp)$/)) return 'i-catppuccin-image'
    
    // 文档文件
    if (fileName.endsWith('.md')) return 'i-catppuccin-markdown-mdx'
    if (fileName.endsWith('.txt')) return 'i-catppuccin-text'
    
    // 默认文件图标
    return 'i-catppuccin-file'
  }

  const getFolderIcon = (folderName: string) => {
    if (folderName === 'components') return 'i-catppuccin-folder-components'
    if (folderName === 'pages') return 'i-catppuccin-folder-packages'
    if (folderName === 'public') return 'i-catppuccin-folder-assets'
    if (folderName === 'src') return 'i-catppuccin-folder-src'
    if (folderName === 'ui') return 'i-catppuccin-folder-themes'
    if (folderName === 'layout') return 'i-catppuccin-folder-layouts'
    if (folderName === 'snippets') return 'i-catppuccin-folder-templates'
    return 'i-catppuccin-folder'
  }

  if (nodeState.isBranch) {
    return (
      <div {...api.getBranchProps(nodeProps)} className="tree-branch">
        <div
          {...api.getBranchControlProps(nodeProps)}
          className="tree-branch-control"
        >
          <span
            {...api.getBranchIndicatorProps(nodeProps)}
            className="tree-branch-indicator"
          >
            <div className={`tree-chevron ${nodeState.expanded ? 'expanded' : ''}`} />
          </span>
          <div className="tree-icon-container">
            <div 
              className={`tree-icon ${getFolderIcon(node.name)}`}
            />
          </div>
          <span {...api.getBranchTextProps(nodeProps)} className="tree-branch-text">
            {node.name}
          </span>
        </div>
        {nodeState.expanded && (
          <div
            {...api.getBranchContentProps(nodeProps)}
            className="tree-branch-content"
          >
            {node.children?.map((childNode, index) => (
              <TreeNode
                key={childNode.id}
                node={childNode}
                indexPath={[...indexPath, index]}
                api={api}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      {...api.getItemProps(nodeProps)}
      className="tree-item"
    >
      <div className="tree-item-spacer" />
      <div className="tree-file-icon-container">
        <div 
          className={`tree-file-icon ${getFileIcon(node.name)}`}
        />
      </div>
      <span className="tree-item-text">
        {node.name}
      </span>
    </div>
  )
}
