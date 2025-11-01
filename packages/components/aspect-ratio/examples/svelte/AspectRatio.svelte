<script lang="ts">
import * as aspectRatio from '../../index'
import { normalizeProps, useMachine } from '@destyler/svelte'
import { aspectRatioControls } from '@destyler/shared-private'
import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
import '../style.css'

const controls = useControls(aspectRatioControls)

const uid = $props.id();

const [state, send] = useMachine(aspectRatio.machine({
  id: uid,
}),{
  context:controls.context
})
const api = $derived(aspectRatio.connect(state, send, normalizeProps))
</script>

<Layout>
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

  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
