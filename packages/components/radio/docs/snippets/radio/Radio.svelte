<script lang="ts">
  import * as radio from '@destyler/radio'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '@docs/styles/components/radio.css'

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

<div {...api.getRootProps()}>
  {#each items as opt (opt.id)}
    <div class="mt-0! flex items-center space-x-3">
      <label {...api.getItemProps({ value: opt.id })}>
        <div class="mt-0! relative">
          <input {...api.getItemHiddenInputProps({ value: opt.id })}>
          <div {...api.getItemControlProps({ value: opt.id })}></div>
        </div>
        <span {...api.getItemTextProps({ value: opt.id })}>
          {opt.label}
        </span>
      </label>
    </div>
  {/each}
</div>
