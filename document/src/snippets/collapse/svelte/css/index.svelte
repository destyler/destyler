<script lang="ts">
  import * as collapse from '@destyler/collapse'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const data = [
    {
      title: 'Watercraft',
      content: 'Experience the thrill of cutting-edge marine vessels, from luxury yachts to high-performance speedboats.',
    },
    {
      title: 'Automobiles',
      content: 'Discover our premium selection of automobiles, featuring the latest in automotive technology and design.',
    },
    {
      title: 'Aircraft',
      content: 'Explore our range of aircraft, from private jets to commercial airliners, all equipped with state-of-the-art technology.',
    },
  ]

  const id = $props.id()
  const [state, send] = useMachine(collapse.machine({ id }))
  const api = $derived(collapse.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="collapse-root">
  {#each data as item (item.title)}
    <div {...api.getItemProps({ value: item.title })} class="collapse-item">
      <h3 class="collapse-header">
        <button
          {...api.getItemTriggerProps({ value: item.title })}
          class="collapse-trigger"
        >
          <span>{item.title}</span>
          <div class="collapse-indicator"></div>
        </button>
      </h3>
      <div
        {...api.getItemContentProps({ value: item.title })}
        class="collapse-content"
      >
        <div class="collapse-content-inner">
          <p class="collapse-text">
            {item.content}
          </p>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  @import './index.css';
</style>
