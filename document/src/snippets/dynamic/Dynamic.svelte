<script lang="ts">
  import * as dynamic from "@destyler/dynamic";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import '../../styles/components/dynamic.css'

  const [state, send] = useMachine(
    dynamic.machine({
      id: crypto.randomUUID(),
      value: ["Svelte", 'Destyler'],
    }),
  );

  const api = $derived(dynamic.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()}>
  <div class="flex flex-wrap gap-2 mb-4">
    {#each api.value as value, index (index)}
      <span {...api.getItemProps({ index, value })}>
        <div {...api.getItemPreviewProps({ index, value })}>
          <span>{value}</span>
          <button {...api.getItemDeleteTriggerProps({ index, value })}>
          </button>
        </div>
        <input {...api.getItemInputProps({ index, value })} />
      </span>
    {/each}
  </div>
  <div class="relative">
    <input placeholder="Add Tag..." {...api.getInputProps()} />
  </div>
</div>
