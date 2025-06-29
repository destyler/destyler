<script lang="ts">
  import * as radio from "@destyler/radio";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { radioControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(radioControls);

  const items = [
    { id: "apple", label: "Apples" },
    { id: "orange", label: "Oranges" },
    { id: "mango", label: "Mangoes" },
    { id: "grape", label: "Grapes" },
  ];

  const [state, send] = useMachine(radio.machine({ id: crypto.randomUUID() }), {
    context: controls.context,
  });

  const api = $derived(radio.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="max-w-md p-6 border border-gray-200 rounded-lg shadow-sm">
  <h3 {...api.getLabelProps()} class="text-xl font-semibold mb-4 text-gray-800">Fruits</h3>
  {#each items as opt (opt.id)}
    <div class="mb-3">
      <label
        {...api.getItemProps({ value: opt.id })}
        class="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors"
      >
        <input {...api.getItemHiddenInputProps({ value: opt.id })} />
        <div
          {...api.getItemControlProps({ value: opt.id })}
          class="w-4 h-4 border-2 border-gray-300 rounded-full transition-colors data-[state=checked]:bg-black data-[state=checked]:border-black"
        >
        </div>
        <span
          {...api.getItemTextProps({ value: opt.id })}
          class="text-gray-700 group-hover:text-gray-900"
        >
          {opt.label}
        </span>
      </label>
    </div>
  {/each}
</div>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
