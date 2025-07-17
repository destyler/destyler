<script lang="ts">
  import * as carousel from '@destyler/carousel'
  import { carouselControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/carousel.css'

  const controls = useControls(carouselControls)

  const items = [
    'https://elonehoo.me/coffee/01.jpeg',
    'https://elonehoo.me/coffee/02.jpeg',
  ]

  const uid = $props.id();

  const [snapshot, send] = useMachine(
    carousel.machine({
      id: uid,
      slideCount: items.length,
      spacing: '20px',
      slidesPerPage: 1,
      autoplay: false,
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(carousel.connect(snapshot, send, normalizeProps))
</script>

<div
  {...api.getRootProps()}
  class="carousel-root"
>
  <div {...api.getItemGroupProps()} class="carousel-item-group">
    {#each items as image, index}
      <div {...api.getItemProps({ index })}>
        <img src={image} alt="" />
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
      class="carousel-trigger"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
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
      class="carousel-trigger"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
    </button>
  </div>
</div>

  <div class="carousel-other-controls">
    <button class="button" onclick={()=>api.scrollToIndex(1)}>
      Scroll to 1
    </button>
    <button {...api.getAutoplayTriggerProps()} class="button">
      { api.isPlaying ? 'Stop' : 'Play' }
    </button>
  </div>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
