<script lang="ts">
  import * as progress from "@destyler/progress"
  import { normalizeProps, useMachine } from "@destyler/svelte"

  const id = $props.id()

  const [state, send] = useMachine(progress.machine({ id, value: 30 }))

  const api = $derived(progress.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="w-full">
  <div
    {...api.getTrackProps()}
    class="h-2 w-full overflow-hidden rounded-full bg-secondary"
  >
    <div
      {...api.getRangeProps()}
      class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-out"
    >
    </div>
  </div>
</div>
