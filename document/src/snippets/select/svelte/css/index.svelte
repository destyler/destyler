<script lang="ts">
  import * as select from '@destyler/select'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'

  const selectData = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' },
  ]

  const id = $props.id()

  const [state, send] = useMachine(
    select.machine({
      id,
      collection: select.collection({
        items: selectData,
      }),
    }),
  )

  const api = $derived(select.connect(state, send, normalizeProps))
</script>

<div class="select-container">
  <button
    {...api.getTriggerProps()}
    class="select-trigger"
  >
    <span class="select-value">{api.valueAsString || "Select option"}</span>
    <span class="select-icon"></span>
  </button>
</div>

{#if api.open}
  <div use:portal>
    <div
      {...api.getPositionerProps()}
      class="select-dropdown-positioner"
    >
      <ul
        {...api.getContentProps()}
        class="select-dropdown"
      >
        {#each selectData as item (item.value)}
          <li
            {...api.getItemProps({ item })}
            class="select-option"
          >
            <span>{item.label}</span>
            <span
              {...api.getItemIndicatorProps({ item })}
              class="select-indicator"
            >
              <span class="select-check"></span>
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  @import './index.css';
</style>
