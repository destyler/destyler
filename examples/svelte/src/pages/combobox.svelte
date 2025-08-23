<script lang="ts">
  import * as combobox from '@destyler/combobox';
  import { comboboxControls } from '@destyler/shared-private';
  import { normalizeProps, useMachine } from '@destyler/svelte';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import { matchSorter } from "match-sorter"
  import '@destyler/shared-private/styles/combobox.css'

  const controls = useControls(comboboxControls);

  const comboboxData = [
    { label: 'Zambia', code: 'ZA' },
    { label: 'Benin', code: 'BN' },
    { label: 'Canada', code: 'CA' },
    { label: 'United States', code: 'US' },
    { label: 'Japan', code: 'JP' },
    { label: 'Nigeria', code: 'NG' },
    { label: 'Albania', code: 'AL' },
    { label: 'Algeria', code: 'DZ' },
    { label: 'American Samoa', code: 'AS' },
    { label: 'Andorra', code: 'AD' },
    { label: 'Angola', code: 'AO' },
    { label: 'Anguilla', code: 'AI' },
    { label: 'Antarctica', code: 'AQ' },
    { label: 'Australia', code: 'AU' },
    { label: 'Austria', code: 'AT' },
    { label: 'Azerbaijan', code: 'AZ' },
    { label: 'Bahamas', code: 'BS' },
    { label: 'Bahrain', code: 'BH' },
    { label: 'Madagascar', code: 'MG' },
    { label: 'Malawi', code: 'MW' },
    { label: 'Malaysia', code: 'MY' },
    { label: 'Maldives', code: 'MV' },
    { label: 'Mali', code: 'ML' },
    { label: 'Malta', code: 'MT' },
    { label: 'Togo', code: 'TG' },
    { label: 'Tokelau', code: 'TK' },
    { label: 'Tonga', code: 'TO' },
    { label: 'Trinidad and Tobago', code: 'TT' },
    { label: 'Tunisia', code: 'TN' },
  ]

  let options = $state.raw(comboboxData);

  const collection = combobox.collection({
    items: comboboxData,
    itemToValue: item => item.code,
    itemToString: item => item.label,
  });

  controls.setContext("collection", collection)

  const id = $props.id();

  const [snapshot, send] = useMachine(
    combobox.machine({
      id: id,
      collection,
      onOpenChange() {
        options = comboboxData;
      },
      onInputValueChange({ inputValue }) {
        const filtered = matchSorter(comboboxData, inputValue, { keys: ["label"] })
        const newOptions = filtered.length > 0 ? filtered : comboboxData

        collection.setItems(newOptions)
        options = newOptions
      },
    }),
    {
      context: controls.context,
    }
  );

  const api = $derived(combobox.connect(snapshot, send, normalizeProps));
  $inspect(api.inputValue)
</script>

<div {...api.getRootProps()} class="combobox-root">
  <label {...api.getLabelProps()} class="combobox-label">
    Select country
  </label>

  <div {...api.getControlProps()} class="combobox-control">
    <input
      {...api.getInputProps()}
      class="combobox-input"
    />
    <button
      {...api.getTriggerProps()}
      class="group combobox-trigger"
    >
      <div class="combobox-trigger-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg>
      </div>
    </button>
    <button {...api.getClearTriggerProps()} class="combobox-clear-trigger">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg>
    </button>
  </div>
</div>


<div
  {...api.getPositionerProps()}
  class="combobox-positioner"
>
  {#if options.length > 0}
    <ul
      {...api.getContentProps()}
      class="combobox-content"
    >
      {#each options as item (item.code)}
        <li
          {...api.getItemProps({ item })}
          class="combobox-item"
        >
          {item.label}
        </li>
      {/each}
    </ul>
  {/if}
</div>


<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
