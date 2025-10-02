<script lang="ts">
  import * as label from '@destyler/label'
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import '@docs/styles/components/label.css'

  const id = $props.id()
  const [state, send] = useMachine(label.machine({ id }))

  const api = $derived(label.connect(state, send, normalizeProps))
</script>

<div class="flex flex-wrap items-center gap-[15px] px-5">
  <label {...api.getRootProps()}>
    First name
  </label>
  <input
    id="firstName"
    class="bg-input border inline-flex h-[35px] w-[200px]
    appearance-none items-center justify-center rounded-lg
    px-[10px] text-sm leading-none shadow-sm outline-none
    focus:shadow-[0_0_0_2px_black] text-foreground
    selection:color-primary selection:bg-background"
    type="text"
    value="Elone Hoo"
  >
</div>

