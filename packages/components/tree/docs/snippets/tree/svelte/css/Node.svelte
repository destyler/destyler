<script lang="ts">
  import type { Api } from '@destyler/tree'

  interface Node {
    id: string
    name: string
    children?: Node[]
  }

  export let node: Node
  export let indexPath: number[]
  export let api: Api

  $: nodeProps = {
    indexPath,
    node,
  }

  $: nodeState = api.getNodeState(nodeProps)

  const getFileIcon = (fileName: string) => {
    // Vue 文件
    if (fileName.endsWith('.svelte')) return 'i-catppuccin-svelte'

    // 配置文件
    if (fileName === 'package.json') return 'i-catppuccin-package-json'
    if (fileName.includes('tsconfig')) return 'i-catppuccin-typescript-config'
    if (fileName.includes('vite.config')) return 'i-catppuccin-vite'
    if (fileName.includes('svelte.config')) return 'i-catppuccin-svelte-config'
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
</script>

{#if nodeState.isBranch}
  <div {...api.getBranchProps(nodeProps)} class="tree-branch">
    <div
      {...api.getBranchControlProps(nodeProps)}
      class="tree-branch-control"
    >
      <span
        {...api.getBranchIndicatorProps(nodeProps)}
        class="tree-branch-indicator"
      >
        <div class="tree-chevron i-carbon-chevron-right" class:expanded={nodeState.expanded}></div>
      </span>
      <div class="tree-icon-container">
        <div 
          class="tree-icon {getFolderIcon(node.name)}"
        ></div>
      </div>
      <span {...api.getBranchTextProps(nodeProps)} class="tree-branch-text">
        {node.name}
      </span>
    </div>
    {#if nodeState.expanded}
      <div
        {...api.getBranchContentProps(nodeProps)}
        class="tree-branch-content"
      >
        {#each node.children || [] as childNode, index}
          <svelte:self
            node={childNode}
            indexPath={[...indexPath, index]}
            api={api}
          />
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div
    {...api.getItemProps(nodeProps)}
    class="tree-item"
  >
    <div class="tree-item-spacer"></div>
    <div class="tree-file-icon-container">
      <div 
        class="tree-file-icon {getFileIcon(node.name)}"
      ></div>
    </div>
    <span class="tree-item-text">
      {node.name}
    </span>
  </div>
{/if}
