<script lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/svelte'
import {aspectRatioControls} from '@destyler/shared-private'
import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
import '@destyler/shared-private/styles/aspect-ratio.css'

const controls = useControls(aspectRatioControls)

const uid = $props.id();

const [snapshot, send] = useMachine(aspectRatio.machine({
  id: uid,
}),{
  context:controls.context
})
const api = $derived(aspectRatio.connect(snapshot, send, normalizeProps))
</script>

<main>
  <div class="aspect-ratio-root">
    <div {...api.getRootProps()}>
      <div {...api.getContentProps()}>
        <img
          class="aspect-ratio-img"
          alt='cat'
          src="https://elonehoo.me/gallery/20_sun.jpg"
        />
      </div>
    </div>
  </div>
</main>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
