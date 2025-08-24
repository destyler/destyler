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

<div {...api.getRootProps()} class="radio-root">
  {#each items as opt (opt.id)}
    <div class="radio-option">
      <label
        {...api.getItemProps({ value: opt.id })}
        class="radio-label"
      >
        <div class="radio-wrapper">
          <input
            {...api.getItemHiddenInputProps({ value: opt.id })}
            class="radio-input"
          >
          <div
            {...api.getItemControlProps({ value: opt.id })}
            class="radio-control"
          ></div>
        </div>
        <span
          {...api.getItemTextProps({ value: opt.id })}
          class="radio-text"
        >
          {opt.label}
        </span>
      </label>
    </div>
  {/each}
</div>
