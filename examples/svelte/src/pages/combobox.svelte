<script lang="ts">
  import * as combobox from '@destyler/combobox';
  import { comboboxControls } from '@destyler/shared-private-private';
  import { normalizeProps, useMachine } from '@destyler/svelte';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(comboboxControls);

  const comboboxData = [
    { label: 'Zambia', code: 'ZA' },
    { label: 'Benin', code: 'BN' },
    { label: 'Canada', code: 'CA' },
    { label: 'Japan', code: 'JA' },
    { label: 'Nigeria', code: 'NG' },
  ];

  let options = comboboxData;

  const collection = combobox.collection({
    items: options,
    itemToValue: item => item.code,
    itemToString: item => item.label,
  });

  const id = $props.id();

  const [state, send] = useMachine(
    combobox.machine({
      id: id,
      collection,
      onOpenChange() {
        options = comboboxData;
      },
      onInputValueChange({ inputValue }) {
        const filtered = comboboxData.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        options = filtered.length > 0 ? filtered : comboboxData;
      },
    }),
    {
      context: {
        ...controls.context,
        collection,
      },
    }
  );

  const api = $derived(combobox.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="w-full max-w-xs mt-8 px-4">
  <label {...api.getLabelProps()} class="block text-sm font-medium text-gray-700 mb-2">
    Select country
  </label>

  <div {...api.getControlProps()} class="relative mt-1">
    <input
      {...api.getInputProps()}
      class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-dark focus:outline-none focus:ring-1 focus:ring-dark"
    />
    <button
      {...api.getTriggerProps()}
      class="group absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
    >
      <div class="text-gray-400 i-carbon:chevron-down group-data-[state=open]:rotate--180 transition-transform duration-300" ></div>
    </button>
  </div>
</div>

{#if options.length > 0}
  <div
    {...api.getPositionerProps()}
    class="w-full max-w-md mt-1 bg-white"
  >
    <ul
      {...api.getContentProps()}
      class="max-h-60 overflow-auto py-1 px-2 rounded-md shadow-lg border border-gray-200"
    >
      {#each options as item (item.code)}
        <li
          {...api.getItemProps({ item })}
          class="px-3 py-2 rounded-md data-[highlighted]:bg-dark-100 cursor-pointer text-gray-900 data-[highlighted]:text-light-100"
        >
          {item.label}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
