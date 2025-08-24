<script lang="ts">
  import * as toggle from "@destyler/toggle";
  import { normalizeProps, useMachine } from "@destyler/svelte";


  const id = $props.id();
  const [state, send] = useMachine(toggle.machine({ 
    id,
    multiple: true,
    value: ['bold'],
  }));

  const api = $derived(toggle.connect(state, send, normalizeProps));
</script>

<div class="toggle-group-container">
  <div
    {...api.getRootProps()}
    class="toggle-group-root"
  >
    {#each ['bold', 'italic', 'underline'] as item, index (index)}
      <button
        {...api.getItemProps({ value: item })}
        class="toggle-group-item"
      >
        {item[0].toUpperCase()}
      </button>
    {/each}
  </div>
</div>
