<script lang="ts">
  import * as progress from "@destyler/progress"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import './index.css'

  const id = $props.id()

  const [state, send] = useMachine(progress.machine({ id, value: 30 }))

  const api = $derived(progress.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="progress-root">
  <div
    {...api.getTrackProps()}
    class="progress-track"
  >
    <div
      {...api.getRangeProps()}
      class="progress-range"
    >
    </div>
  </div>
</div>
