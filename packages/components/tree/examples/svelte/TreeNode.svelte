<script lang="ts">
  import type { FileNode } from '../data'
  import type { Api } from '../../index'

  export let node: FileNode
  export let indexPath: number[]
  export let api: Api

  $: nodeProps = { node, indexPath }
  $: nodeState = api.getNodeState(nodeProps)
  $: childCount = node.children?.length ?? 0
</script>

{#if nodeState.isBranch}
  <div {...api.getBranchProps(nodeProps)}>
    <div {...api.getBranchControlProps(nodeProps)}>
      <span {...api.getBranchIndicatorProps(nodeProps)}></span>
      <span {...api.getBranchTextProps(nodeProps)}>{node.name}</span>
      <span class="tree-example__meta">{childCount} items</span>
    </div>
    {#if nodeState.expanded}
      <div {...api.getBranchContentProps(nodeProps)}>
        <div {...api.getBranchIndentGuideProps(nodeProps)}></div>
        {#each node.children ?? [] as child, index}
          <svelte:self node={child} indexPath={[...indexPath, index]} {api} />
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div {...api.getItemProps(nodeProps)}>
    <span {...api.getItemIndicatorProps(nodeProps)}></span>
    <span {...api.getItemTextProps(nodeProps)}>{node.name}</span>
  </div>
{/if}
