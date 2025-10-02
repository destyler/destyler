/** @jsxImportSource solid-js */
import type { Api } from '@destyler/tree'
import { createMemo } from 'solid-js'

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

export default function TreeNode(props: TreeNodeProps) {
  const nodeProps = createMemo(() => ({
    indexPath: props.indexPath,
    node: props.node,
  }))

  const nodeState = createMemo(() => props.api.getNodeState(nodeProps()))

  const getFileIcon = (fileName: string) => {
    // Vue 文件
    if (fileName.endsWith('.tsx')) return 'i-catppuccin-solid'

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

  return (
    <>
      {createMemo(() => nodeState().isBranch)()
        ? (
            <div {...props.api.getBranchProps(nodeProps())} class="tree-branch">
              <div
                {...props.api.getBranchControlProps(nodeProps())}
                class="tree-branch-control"
              >
                <span
                  {...props.api.getBranchIndicatorProps(nodeProps())}
                  class="tree-branch-indicator"
                >
                  <div class={`i-carbon-chevron-right tree-chevron ${nodeState().expanded ? 'expanded' : ''}`} />
                </span>
                <div class="tree-icon-container">
                  <div 
                    class={`${getFolderIcon(props.node.name)} tree-icon`}
                  />
                </div>
                <span {...props.api.getBranchTextProps(nodeProps())} class="tree-branch-text">
                  {props.node.name}
                </span>
              </div>
              {nodeState().expanded && (
                <div
                  {...props.api.getBranchContentProps(nodeProps())}
                  class="tree-branch-content"
                >
                  {props.node.children?.map((childNode, index) => (
                    <TreeNode
                      node={childNode}
                      indexPath={[...props.indexPath, index]}
                      api={props.api}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        : (
            <div
              {...props.api.getItemProps(nodeProps())}
              class="tree-item"
            >
              <div class="tree-item-spacer" />
              <div class="tree-file-icon-container">
                <div 
                  class={`${getFileIcon(props.node.name)} tree-file-icon`}
                />
              </div>
              <span class="tree-item-text">
                {props.node.name}
              </span>
            </div>
          )}
    </>
  )
}
