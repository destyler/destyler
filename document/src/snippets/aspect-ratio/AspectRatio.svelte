<script lang="ts">
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/svelte'
import '../../styles/components/aspect-radio.css'

const uid = $props.id();

const [state, send] = useMachine(aspectRatio.machine({
  id: uid,
  ratio: 16 / 9,
}))
const api = $derived(aspectRatio.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getContentProps()}>
    <img
      src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
    />
  </div>
</div>
