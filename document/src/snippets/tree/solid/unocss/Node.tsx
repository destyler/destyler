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
            <div {...props.api.getBranchProps(nodeProps())} class="mt-0!">
              <div
                {...props.api.getBranchControlProps(nodeProps())}
                class="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer select-none mt-0!"
              >
                <span
                  {...props.api.getBranchIndicatorProps(nodeProps())}
                  class="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground/80 mt-0!"
                >
                  <div class={`i-carbon-chevron-right h-3.5 w-3.5 mt-0! ${nodeState().expanded ? 'rotate-90' : ''}`} />
                </span>
                <div class="flex h-5 w-5 shrink-0 items-center justify-center mt-0!">
                  <div 
                    class={`${getFolderIcon(props.node.name)} h-4 w-4 mt-0!`}
                  />
                </div>
                <span {...props.api.getBranchTextProps(nodeProps())} class="text-foreground/95 font-medium mt-0!">
                  {props.node.name}
                </span>
              </div>
              {nodeState().expanded && (
                <div
                  {...props.api.getBranchContentProps(nodeProps())}
                  class="mt-0! space-y-1 border-l-2 border-border/30 pl-4"
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
              class="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer select-none mt-0!"
            >
              <div class="h-4 w-4 shrink-0 mt-0!" />
              <div class="flex h-4 w-4 shrink-0 items-center justify-center mt-0!">
                <div 
                  class={`${getFileIcon(props.node.name)} h-3.5 w-3.5 mt-0!`}
                />
              </div>
              <span class="text-muted-foreground/80 mt-0!">
                {props.node.name}
              </span>
            </div>
          )}
    </>
  )
}
