<script lang="ts">
  import * as label from '@destyler/label'
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const id = $props.id()
  const [state, send] = useMachine(label.machine({ id }))

  const api = $derived(label.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()}>
  text
</label>

<Toolbar>
  <StateVisualizer state={state} />
</Toolbar>
