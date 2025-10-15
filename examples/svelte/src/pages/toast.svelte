<script lang="ts">
  import * as toast from '@destyler/toast'
  import {normalizeProps, useMachine, portal} from '@destyler/svelte'
  import '@destyler/shared-private/styles/toast.css'
  import ToastItem from '../components/ToastItem.svelte';

  const id = $props.id()

  const [state, send] = useMachine(
    toast.group.machine({
      id: id,
      placement: 'bottom-end',
      overlap: true,
      removeDelay: 200,
    }),
  )

  const api = $derived(toast.group.connect(state as any, send, normalizeProps))
</script>

<button
  class="create-trigger"
  onclick={() => {
    api.create({
      title: "Fetching data...",
      type: "info",
    })
  }}
>
  Notify
</button>

<div use:portal>
  {#each api.getPlacements() as placement}
    <div {...api.getGroupProps({ placement })}>
      {#each api.getToastsByPlacement(placement) as toast (toast.id)}
        <ToastItem actor={toast} />
      {/each}
    </div>
  {/each}
</div>
