<script lang="ts">
  import * as presence from "@destyler/presence"
  import { useMachine, normalizeProps } from "@destyler/svelte"
  import { createEventDispatcher } from 'svelte'

  export let present: boolean
  export let unmountOnExit: boolean = false

  const dispatch = createEventDispatcher()

  let nodeRef: HTMLElement

  const [state, send] = useMachine(presence.machine({ present }), {
    context: {
      present,
      onExitComplete: () => dispatch("exit-complete")
    },
  })

  $: api = presence.connect(state, send, normalizeProps)
  $: unmount = !api.present && unmountOnExit

  $: if (nodeRef) {
    api.setNode(nodeRef)
  }
</script>

{#if !unmount}
  <div
    bind:this={nodeRef}
    hidden={!api.present}
    data-state={api.skip ? undefined : present ? 'open' : 'closed'}
    {...$$restProps}
  ></div>
{/if}
