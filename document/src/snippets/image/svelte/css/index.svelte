<script lang="ts">
  import * as image from '@destyler/image'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './index.css'

  const id = $props.id()

  const [state, send] = useMachine(image.machine({ id }))

  const api = $derived(image.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="root">
  <img
    alt="EH"
    src="https://github.com/destyler.png"
    {...api.getImageProps()}
    class="image"
  />
  <div
    {...api.getFallbackProps()}
    class="fallback"
  >
    EH
  </div>
</div>
