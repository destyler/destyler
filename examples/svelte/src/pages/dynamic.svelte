<script lang="ts">
  import * as dynamic from "@destyler/dynamic";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { dynamicControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/dynamic.css'

  const controls = useControls(dynamicControls);

  const [state, send] = useMachine(
    dynamic.machine({
      id: crypto.randomUUID(),
      value: ["React", "Vue"],
    }),
    {
      context: controls.context,
    }
  );

  const api = $derived(dynamic.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="dynamic-root">
  <div class="dynamic-content">
    {#each api.value as value, index (index)}
      <span {...api.getItemProps({ index, value })} class="group" style="position: relative;">
        <div
          data-testid={`${value.toLowerCase()}-input`}
          {...api.getItemPreviewProps({ index, value })}
          class="dynamic-item-preview"
        >
          <span class="dynamic-item-preview-value">{value}</span>
          <button
            {...api.getItemDeleteTriggerProps({ index, value })}
            class="dynamic-item-delete-trigger"
            data-testid={`${value.toLowerCase()}-delete-trigger`}
          >
            &#x2715;
          </button>
        </div>
        <input
          {...api.getItemInputProps({ index, value })}
          data-testid={`${value.toLowerCase()}-item-input`}
        />
      </span>
    {/each}
  </div>
  <input
    placeholder="Add tag..."
    {...api.getInputProps()}
    class="dynamic-input"
  />
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
