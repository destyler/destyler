<script lang="ts">
  import * as select from '@destyler/select'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './style.css'

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

<div class="flex flex-col outline-none! mt-0!">
  <button {...api.getTriggerProps()}>
    <span>{api.valueAsString || "Select option"}</span>
    <span></span>
  </button>
</div>

{#if api.open}
  <div use:portal>
    <div data-layout="sinppets" {...api.getPositionerProps()}>
      <ul {...api.getContentProps()}>
        {#each selectData as item (item.value)}
          <li {...api.getItemProps({ item })}>
            <span>{item.label}</span>
            <span {...api.getItemIndicatorProps({ item })}>
              <span></span>
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </div>

{/if}
