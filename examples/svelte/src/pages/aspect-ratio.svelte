<script lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/svelte'
import {aspectRatioControls} from '@destyler/shared'
import Toolbar from '../components/toolbar.svelte'
import StateVisualizer from "../components/state-visualizer.svelte"
import {useControls} from '../hooks/use-controls.svelte'

const controls = useControls(aspectRatioControls)

const uid = $props.id();

const [state, send] = useMachine(aspectRatio.machine({
  id: uid,
}),{
  context:controls.context
})
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

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
