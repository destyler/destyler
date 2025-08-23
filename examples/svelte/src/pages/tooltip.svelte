<script lang="ts">
  import '@destyler/shared-private/styles/tooltip.css'
  import * as tooltip from "@destyler/tooltip";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const id1 = 'tip-1'
  const id2 = 'tip-2'

  const [state1, send1] = useMachine(tooltip.machine({ id: id1 }));

  const api1 = $derived(tooltip.connect(state1, send1, normalizeProps));

  const [state2, send2] = useMachine(tooltip.machine({ id: id2 }));

  const api2 = $derived(tooltip.connect(state2, send2, normalizeProps));
</script>

<div data-testid="focus">focus</div>
<div class="tooltip-root">
  <button
    {...api1.getTriggerProps()}
    class="tooltip-trigger"
    data-testid={`${id1}-trigger`}
  >
    Hover me
  </button>
  <div {...api1.getPositionerProps()} class="tooltip-positioner">
    <div
      {...api1.getContentProps()}
      class="tooltip-content"
      data-testid={`${id1}-tooltip`}
    >
      Tooltip 1
    </div>
  </div>
</div>
<div class="tooltip-root">
  <button
    {...api2.getTriggerProps()}
    class="tooltip-trigger"
    data-testid={`${id2}-trigger`}
  >
    Over me
  </button>
  <div {...api2.getPositionerProps()} class="tooltip-positioner">
    <div
      {...api2.getContentProps()}
      class="tooltip-content"
      data-testid={`${id2}-tooltip`}
    >
      Tooltip 2
    </div>
  </div>
</div>

<Toolbar>
  <StateVisualizer state={state1} />
  <StateVisualizer state={state2} />
</Toolbar>

