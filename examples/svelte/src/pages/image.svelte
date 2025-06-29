<script lang="ts">
  import * as image from "@destyler/image"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const id = $props.id()

  const [ state, send ] = useMachine(image.machine({ id }))

  const api = $derived(image.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
  <div {...api.getFallbackProps()} class="h-full w-full rounded-full bg-dark text-white">
    EH
  </div>
  <img
    alt="EH"
    src="https://github.com/elonehoo.png"
    {...api.getImageProps()}
    class="aspect-square h-full w-full"
  />
</div>

<Toolbar>
  <StateVisualizer state={state} />
</Toolbar>
