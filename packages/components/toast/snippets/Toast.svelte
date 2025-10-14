<script lang="ts">
  import * as toast from '@destyler/toast'
  import {normalizeProps, useMachine, portal} from '@destyler/svelte'
  import ToastItem from './Item.svelte';
  import './style.css'


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

  function handleNotify(){
    api.create({
      title: "What to say?",
      type: "info",
    })
  }
</script>

<button
  class="btn"
  onclick={handleNotify}
>
  Notify
</button>

<div use:portal>
  {#each api.getPlacements() as placement}
    <div key={placement} data-layout="sinppets" {...api.getGroupProps({ placement })}>
      {#each api.getToastsByPlacement(placement) as toast (toast.id)}
        <ToastItem actor={toast} />
      {/each}
    </div>
  {/each}
</div>
