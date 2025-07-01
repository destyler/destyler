<script lang="ts">
  import * as carousel from '../../index'
  import { carouselControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(carouselControls)

  const items = [
    'https://elonehoo.me/coffee/01.jpeg',
    'https://elonehoo.me/coffee/02.jpeg',
  ]

  const uid = $props.id();

  const [state, send] = useMachine(
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

  const api = $derived(carousel.connect(state, send, normalizeProps))
</script>

<div
  {...api.getRootProps()}
>
  <div {...api.getItemGroupProps()}>
    {#each items as image, index}
      <div {...api.getItemProps({ index })}>
        <img src={image} alt="" />
      </div>
    {/each}
  </div>

  <!-- control -->
  <button onclick={() => api.scrollToIndex(1)}>Scroll to 1</button>
  <div
    {...api.getControlProps()}
  >
    <button {...api.getAutoplayTriggerProps()}>{api.isPlaying ? 'Stop' : 'Play'}</button>
    <button
      {...api.getPrevTriggerProps()}
    >
    </button>
    <div {...api.getIndicatorGroupProps()}>
      {#each api.pageSnapPoints as _, index}
        <button
          {...api.getIndicatorProps({ index })}
        >
        </button>
      {/each}
    </div>
    <button
      {...api.getNextTriggerProps()}
    >
    </button>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
