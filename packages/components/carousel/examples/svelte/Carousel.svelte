<script lang="ts">
  import * as carousel from '../../index'
  import { carouselControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(carouselControls)

  const items = [
    'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

<Layout>
  <div {...api.getRootProps()}>
    <div {...api.getItemGroupProps()}>
      {#each items as image, index}
        <div {...api.getItemProps({ index })}>
          <img src={image} alt="" />
        </div>
      {/each}
    </div>

    <!-- control -->
    <div {...api.getControlProps()}>
      <button {...api.getPrevTriggerProps()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
      </button>
      <div {...api.getIndicatorGroupProps()}>
        {#each api.pageSnapPoints as _, index}
          <button {...api.getIndicatorProps({ index })}></button>
        {/each}
      </div>
      <button {...api.getNextTriggerProps()} >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
      </button>
    </div>
  </div>

    <div class="carousel-spacer">
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
</Layout>
