<script lang="ts">
  import * as image from "@destyler/image"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/image.css'

  const id = $props.id()

  const [ state, send ] = useMachine(image.machine({ id }))

  const api = $derived(image.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="image-root">
  <div {...api.getFallbackProps()} class="image-fallback">
    EH
  </div>
  <img
    alt="EH"
    src="https://github.com/elonehoo.png"
    {...api.getImageProps()}
    class="image-img"
  />
</div>

<Toolbar>
  <StateVisualizer state={state} />
</Toolbar>
