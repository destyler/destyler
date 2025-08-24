<script lang="ts">
  import * as image from '@destyler/image'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(image.machine({ id }))

  const api = $derived(image.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="relative mt-0! flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
  <img
    alt="EH"
    src="https://github.com/destyler.png"
    {...api.getImageProps()}
    class="aspect-square h-full w-full"
  />
  <div
    {...api.getFallbackProps()}
    class="flex h-full w-full items-center justify-center
    rounded-full bg-muted"
  >
    EH
  </div>
</div>
