<script lang="ts">
  import * as collapse from '@destyler/collapse';
  import { collapseControls } from '@destyler/shared-private';
  import { normalizeProps, useMachine } from '@destyler/svelte';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/collapse.css'

  const controls = useControls(collapseControls);

  const data = [
    {
      id: 'watercraft',
      title: 'Watercraft',
      content: 'Experience the thrill of cutting-edge marine vessels, from luxury yachts to high-performance speedboats.',
    },
    {
      id: 'automobiles',
      title: 'Automobiles',
      content: 'Discover our premium selection of automobiles, featuring the latest in automotive technology and design.',
    },
    {
      id: 'aircraft',
      title: 'Aircraft',
      content: 'Explore our range of aircraft, from private jets to commercial airliners, all equipped with state-of-the-art technology.',
    },
  ]

  const id = $props.id();

  const [snapshot, send] = useMachine(collapse.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(collapse.connect(snapshot, send, normalizeProps));
</script>

<div
  {...api.getRootProps()}
  class="collapse-root"
>
  {#each data as item (item.title)}
    <div
      {...api.getItemProps({ value: item.title })}
      class="collapse-item"
    >
      <h3 style="margin: 0;">
        <button
          data-testid={`${item.id}:trigger`}
          {...api.getItemTriggerProps({ value: item.title })}
          class="group collapse-item-trigger"
        >
          <div class="collapse-item-trigger-title">
            <span class="collapse-item-trigger-title-text">
              {item.title}
            </span>
          </div>
          <div
           class="collapse-item-trigger-icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" /></svg>
          </div>
        </button>
      </h3>
      <div
        data-testid={`${item.id}:content`}
        {...api.getItemContentProps({ value: item.title })}
        class="collapse-item-content"
      >
        <div class="collapse-item-content-box">
          <p class="leading-relaxed">
            {item.content}
          </p>
        </div>
      </div>
    </div>
  {/each}
</div>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
