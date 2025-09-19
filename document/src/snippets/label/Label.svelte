<script lang="ts">
  import * as label from '@destyler/label'
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import '../../styles/components/label.css'

  const id = $props.id()
  const [state, send] = useMachine(label.machine({ id }))

  const api = $derived(label.connect(state, send, normalizeProps))
</script>

<div>
  <label {...api.getRootProps()}>
    First name
  </label>
  <input id="firstName" type="text" value="Elone Hoo">
</div>


