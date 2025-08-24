<script lang="ts">
  import * as switchs from '@destyler/switch'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(switchs.machine({ 
    id,
    checked: true 
  }))

  const api = $derived(switchs.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()} class="flex items-center justify-center cursor-pointer disabled:cursor-not-allowed">
  <input {...api.getHiddenInputProps()}>
  <span
    {...api.getControlProps()}
    class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
  >
    <span
      {...api.getThumbProps()}
      class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    ></span>
  </span>
</label>
