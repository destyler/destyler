<script lang="ts">
  import * as dynamic from "../../index";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { dynamicControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

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

<Layout>
  <main>
    <input data-testid="copy-text" style="margin-bottom: 1rem;" />
    <div {...api.getRootProps()}>
      <div>
        {#each api.value as value, index (index)}
          <span {...api.getItemProps({ index, value })} style="position: relative;">
            <div
              data-testid={`${value.toLowerCase()}-input`}
              {...api.getItemPreviewProps({ index, value })}
            >
              <span>{value}</span>
              <button
                {...api.getItemDeleteTriggerProps({ index, value })}
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
      />
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
