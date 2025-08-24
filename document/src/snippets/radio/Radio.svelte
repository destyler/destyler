<script lang="ts">
  import * as radio from '@destyler/radio'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const items = [
    { id: 'default', label: 'Default' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'compact', label: 'Compact' },
  ]

  const id = $props.id()

  const [state, send] = useMachine(radio.machine({
    id,
    value: 'default',
  }))

  const api = $derived(radio.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="grid gap-2 mt-0!">
  {#each items as opt (opt.id)}
    <div class="mt-0! flex items-center space-x-3">
      <label
        {...api.getItemProps({ value: opt.id })}
        class="flex items-center space-x-2 cursor-pointer"
      >
        <div class="mt-0! relative">
          <input
            {...api.getItemHiddenInputProps({ value: opt.id })}
            class="peer sr-only"
          >
          <div
            {...api.getItemControlProps({ value: opt.id })}
            class="mt-0! h-4 w-4 rounded-full border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          ></div>
        </div>
        <span
          {...api.getItemTextProps({ value: opt.id })}
          class="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {opt.label}
        </span>
      </label>
    </div>
  {/each}
</div>
