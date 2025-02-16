<script lang="ts">
  import type { Api } from "@destyler/tree"

  const {node,indexPath, api} = $props()

  const nodeProps = $derived({
    indexPath,
    node,
  })

  const nodeState = $derived(api.getNodeState(nodeProps))
</script>

{#if nodeState.isBranch}
  <div {...api.getBranchProps(nodeProps)}>
    <div {...api.getBranchControlProps(nodeProps)}>
      <span {...api.getBranchTextProps(nodeProps)}>{node.name}</span>
      <span {...api.getBranchIndicatorProps(nodeProps)}></span>
    </div>
    <div {...api.getBranchContentProps(nodeProps)}>
      <div {...api.getBranchIndentGuideProps(nodeProps)} ></div>
      {#each node.children || [] as childNode, index (childNode.id)}
        <svelte:self
          node={childNode}
          indexPath={[...indexPath, index]}
          {api}
        ></svelte:self>
      {/each}
    </div>
  </div>
{:else}
  <div {...api.getItemProps(nodeProps)}>{node.name}</div>
{/if}
