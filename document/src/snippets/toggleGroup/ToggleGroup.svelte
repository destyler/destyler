<script lang="ts">
  import * as toggle from "@destyler/toggle";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import '../../styles/components/toggle.css'

  const id = $props.id();
  const [state, send] = useMachine(toggle.machine({
    id,
    multiple: true,
    value: ['bold'],
  }));

  const api = $derived(toggle.connect(state, send, normalizeProps));
</script>

<div class="flex items-center justify-center mt-0!">
  <div {...api.getRootProps()}>
    {#each ['bold', 'italic', 'underline'] as item, index (index)}
      <button {...api.getItemProps({ value: item })}>
        {item[0].toUpperCase()}
      </button>
    {/each}
  </div>
</div>
