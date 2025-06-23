<script lang="ts">
  import * as carousel from '@destyler/carousel'
  import { carouselControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

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
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(carousel.connect(state, send, normalizeProps))
</script>

<div
  {...api.getRootProps()}
  class="flex items-center justify-center flex-col gap-4 w-100 relative"
>
  <div {...api.getItemGroupProps()} class="rounded-xl">
    {#each items as image, index}
      <div {...api.getItemProps({ index })}>
        <img src={image} alt="" />
      </div>
    {/each}
  </div>

  <!-- control -->
  <div
    {...api.getControlProps()}
    class="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center bg-dark rounded-md px-2 py-1"
  >
    <button
      {...api.getPrevTriggerProps()}
      class="w-4 h-4 text-light i-carbon:caret-left"
    >
    </button>
    <div {...api.getIndicatorGroupProps()} class="flex gap-2 mx-2">
      {#each api.pageSnapPoints as _, index}
        <button
          {...api.getIndicatorProps({ index })}
          class="w-2 h-2 bg-gray rounded-full data-[current]:bg-green"
        >
        </button>
      {/each}
    </div>
    <button
      {...api.getNextTriggerProps()}
      class="w-4 h-4 text-light i-carbon:caret-right"
    >
    </button>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
