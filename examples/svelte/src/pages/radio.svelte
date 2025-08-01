<script lang="ts">
  import * as radio from "@destyler/radio";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { radioControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/radio.css'

  const controls = useControls(radioControls);

  const items = [
    { id: "apple", label: "Apples" },
    { id: "orange", label: "Oranges" },
    { id: "mango", label: "Mangoes" },
    { id: "grape", label: "Grapes" },
  ];

  const [state, send] = useMachine(radio.machine({
    id: crypto.randomUUID(),
    name: 'fruits',
  }), {
    context: controls.context,
  });

  const api = $derived(radio.connect(state, send, normalizeProps));
</script>

<main class="radio">
  <form>
    <div data-testid="radio-click">radio click</div>
    <fieldset>
      <div {...api.getRootProps()} class="radio-root">
        <h3 {...api.getLabelProps()} class="radio-label">Fruits</h3>
        <div {...api.getIndicatorProps()}></div>

        {#each items as opt (opt.id)}
          <label
            data-testid="radio-{opt.id}"
            class="radio-item"
            {...api.getItemProps({ value: opt.id })}
          >
            <div class="radio-item-control" data-testid="control-{opt.id}" {...api.getItemControlProps({ value: opt.id })}></div>
            <span class="radio-item-label" data-testid="label-{opt.id}" {...api.getItemTextProps({ value: opt.id })}>
              {opt.label}
            </span>
            <input data-testid="input-{opt.id}" {...api.getItemHiddenInputProps({ value: opt.id })} />
          </label>
        {/each}
      </div>

      <button type="reset">Reset</button>
      <button type="button" onclick={() => api.clearValue()}>Clear</button>
      <button type="button" onclick={() => api.setValue('mango')}>Set to Mangoes</button>
      <button type="button" onclick={() => api.focus()}>Focus</button>
    </fieldset>
  </form>
</main>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
