<script lang="ts">
  import * as dynamic from "@destyler/dynamic";
  import { normalizeProps, useMachine } from "@destyler/svelte";


  const [state, send] = useMachine(
    dynamic.machine({
      id: crypto.randomUUID(),
      value: ["Svelte", "Vue"],
    }),
  );

  const api = $derived(dynamic.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="dynamic-root">
  <div class="dynamic-tag-container">
    {#each api.value as value, index (index)}
      <span {...api.getItemProps({ index, value })} class="dynamic-tag-item">
        <div
          {...api.getItemPreviewProps({ index, value })}
          class="dynamic-tag-preview"
        >
          <span class="dynamic-tag-name">{value}</span>
          <button
            {...api.getItemDeleteTriggerProps({ index, value })}
            class="dynamic-delete-button"
          >
          </button>
        </div>
        <input
          {...api.getItemInputProps({ index, value })}
          class="dynamic-tag-input"
        />
      </span>
    {/each}
  </div>
  <div class="dynamic-input-container">
    <input
      placeholder="Add Tag..."
      {...api.getInputProps()}
      class="dynamic-input"
    />
  </div>
</div>
