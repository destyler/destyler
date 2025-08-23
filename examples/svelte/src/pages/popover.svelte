<script lang="ts">
  import * as popover from "@destyler/popover";
  import { normalizeProps, useMachine, portal } from "@destyler/svelte";
  import { popoverControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/popover.css';

  const controls = useControls(popoverControls);

  const id = $props.id();

  const [state, send] = useMachine(popover.machine({ id }), {
    context: controls.context,
  });
  const api = $derived(popover.connect(state, send, normalizeProps));
</script>

<div class="popover-demo-root">
  <button
    {...api.getTriggerProps()}
    class="popover-trigger"
  >
    Click me
  </button>

  <div use:portal={{ disabled: !api.portalled }} {...api.getPositionerProps()} class="popover-positioner">
    <div
      {...api.getContentProps()}
      class="popover-content"
    >
      <div
        {...api.getTitleProps()}
        class="popover-title"
      >
        Presenters
      </div>
      <a href="#" data-testid="focusable-link">
        Focusable Link
      </a>
      <div
        {...api.getDescriptionProps()}
        class="popover-description"
      >
        Description
      </div>
      <button class="popover-action-btn">
        Action Button
      </button>
      <button
        {...api.getCloseTriggerProps()}
        class="popover-close-btn"
      >
        x
      </button>
    </div>
  </div>
  <span data-testid="plain-text">I am just text</span>
  <button data-testid="button-after">Button :after</button>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
