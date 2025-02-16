<script lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/svelte'

const [state, send] = useMachine(aspectRatio.machine({
  id:'1',
}))
const api = $derived(aspectRatio.connect(state, send, normalizeProps))
</script>

<main>
  <div class="w-full sm:w-75 overflow-hidden rounded-md">
    <div {...api.getRootProps()}>
      <div {...api.getContentProps()}>
        <img
          class="h-full w-full object-cover"
          alt='cat'
          src="https://elonehoo.me/gallery/20_sun.jpg"
        />
      </div>
    </div>
  </div>
</main>

