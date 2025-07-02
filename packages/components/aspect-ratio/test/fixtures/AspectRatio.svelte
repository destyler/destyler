<script lang="ts">
import * as aspectRatio from '../../index'
import { normalizeProps, useMachine } from '@destyler/svelte'
import {aspectRatioControls} from '@destyler/shared-private'
import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

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
  <div>
    <div {...api.getRootProps()}>
      <div {...api.getContentProps()}>
        <img
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
