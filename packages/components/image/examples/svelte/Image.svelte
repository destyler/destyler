<script lang="ts">
  import * as avatar from "../../index"
  import { imagesData } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const images = imagesData.full
  const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

  let src = $state(images[0])
  let showImage = $state(true)

  const [snapshot, send] = useMachine(avatar.machine({ id: "1" }))
  const api = $derived(avatar.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main class="image">
  <div {...api.getRootProps()}>
    <span {...api.getFallbackProps()}>PA</span>
    {#if showImage}
      <img alt="" referrerpolicy="no-referrer" {src} {...api.getImageProps()} />
    {/if}
  </div>

  <div class="controls">
    <button onclick={() => (src = getRandomImage())}>Change Image</button>
    <button onclick={() => (src = imagesData.broken)}>Broken Image</button>
    <button onclick={() => (showImage = !showImage)}>Toggle Image</button>
  </div>
</main>

<Toolbar>
  <StateVisualizer state={snapshot} />
</Toolbar>
</Layout>
