<script lang="ts">
  import * as progress from '../../index'
  import { progressControls } from '@destyler/shared-private'
  import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const controls = useControls(progressControls)

  const [stateStore, send] = useMachine(progress.machine({
    id: crypto.randomUUID(),
    value: 25,
    max: 100,
    min: 0
  }), {
    context: controls.context,
  })

  const [indeterminateStateStore, indeterminateSend] = useMachine(progress.machine({
    id: crypto.randomUUID(),
    value: null,
    max: 100,
    min: 0
  }))

  $: api = progress.connect($stateStore, send, normalizeProps)
  $: indeterminateApi = progress.connect($indeterminateStateStore, indeterminateSend, normalizeProps)
</script>

<div>
  <!-- Regular progress -->
  <div {...api.getRootProps()} style:width="300px">
    <div {...api.getLabelProps()}>Progress Label</div>
    <div {...api.getTrackProps()} style:height="10px" style:background="#f0f0f0" style:border-radius="5px">
      <div {...api.getRangeProps()} style:height="100%" style:background="#007acc" style:border-radius="5px" />
    </div>
    <div {...api.getValueTextProps()}>{api.valueAsString}</div>
  </div>

  <!-- Indeterminate progress -->
  <div
    {...indeterminateApi.getTrackProps()}
    data-testid="indeterminate-progress"
    style:height="10px"
    style:background="#f0f0f0"
    style:border-radius="5px"
    style:margin-top="20px"
  >
    <div {...indeterminateApi.getRangeProps()} style:height="100%" style:background="#007acc" style:border-radius="5px" />
  </div>

  <!-- Control buttons -->
  <div style:margin-top="20px">
    <button on:click={() => api.setValue(50)} data-testid="set-value">Set to 50</button>
    <button on:click={() => api.setToMax()} data-testid="set-max">Set to Max</button>
    <button on:click={() => api.setToMin()} data-testid="set-min">Set to Min</button>
  </div>
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
  <svelte:fragment slot="controls">
    <Controls control={controls} />
  </svelte:fragment>
</Toolbar>
