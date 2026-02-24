<script lang="ts">
  import * as image from '@destyler/image'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()

  const [state, send] = useMachine(image.machine({ id }))

  const api = $derived(image.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <img
    alt="Destyler"
    src="https://github.com/destyler.png"
    {...api.getImageProps()}
  />
  <div {...api.getFallbackProps()}>
    EH
  </div>
</div>
