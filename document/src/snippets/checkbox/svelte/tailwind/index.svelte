<script lang="ts">
  import * as checkbox from '@destyler/checkbox'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(checkbox.machine({ id }))

  const api = $derived(checkbox.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()} class="flex items-center gap-2 cursor-pointer">
  <div
    {...api.getControlProps()}
    class="peer h-4 w-4 shrink-0 rounded-sm border border-primary
    shadow-sm focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-ring focus-visible:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
    flex items-center justify-center"
  >
    {#if api.checked}
      <div class="i-carbon-checkmark w-3 h-3" ></div>
    {/if}
  </div>
  <span {...api.getLabelProps()} class="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    Input is
    {#if api.checked}
      checked
    {:else}
      unchecked
    {/if}
  </span>

  <input {...api.getHiddenInputProps()}>
</label>
