<script lang="ts">
  import * as label from '@destyler/label'
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

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
