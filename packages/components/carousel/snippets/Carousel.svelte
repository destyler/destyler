<script lang="ts">
  import * as carousel from '@destyler/carousel'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './style.css'

  const items = [
    'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ]

  const uid = $props.id();

  const [state, send] = useMachine(
    carousel.machine({
      id: uid,
      slideCount: items.length,
      spacing: '20px',
      slidesPerPage: 1,
    }),
  )

  const api = $derived(carousel.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getItemGroupProps()}>
    {#each items as image, index}
      <div {...api.getItemProps({ index })} >
        <img src={image} alt="" />
      </div>
    {/each}
  </div>

  <!-- control -->
  <div {...api.getControlProps()}>
    <button {...api.getPrevTriggerProps()}></button>
    <div {...api.getIndicatorGroupProps()}>
      {#each api.pageSnapPoints as _, index}
        <button {...api.getIndicatorProps({ index })}></button>
      {/each}
    </div>
    <button {...api.getNextTriggerProps()}></button>
  </div>
</div>

