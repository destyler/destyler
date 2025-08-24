<script lang="ts">
  import * as carousel from '@destyler/carousel'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './index.css'

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

<div
  {...api.getRootProps()}
  class="carousel-root"
>
  <div {...api.getItemGroupProps()} class="carousel-item-group">
    {#each items as image, index}
      <div {...api.getItemProps({ index })} class="carousel-item">
        <img src={image} alt="" class="carousel-image" />
      </div>
    {/each}
  </div>

  <!-- control -->
  <div
    {...api.getControlProps()}
    class="carousel-control"
  >
    <button
      {...api.getPrevTriggerProps()}
      class="carousel-prev-button"
    >
    </button>
    <div {...api.getIndicatorGroupProps()} class="carousel-indicator-group">
      {#each api.pageSnapPoints as _, index}
        <button
          {...api.getIndicatorProps({ index })}
          class="carousel-indicator"
        >
        </button>
      {/each}
    </div>
    <button
      {...api.getNextTriggerProps()}
      class="carousel-next-button"
    >
    </button>
  </div>
</div>

