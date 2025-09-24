<script lang="ts">
  import * as progress from "@destyler/progress"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import '../../styles/components/progress.css'

  const id = $props.id()

  const [state, send] = useMachine(progress.machine({ id, value: 30 }))

  const api = $derived(progress.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getTrackProps()}>
    <div {...api.getRangeProps()}></div>
  </div>
</div>
