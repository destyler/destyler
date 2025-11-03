<script lang="ts">
  import * as popover from "../../index"
  import { normalizeProps, portal, useMachine } from "@destyler/svelte"
  import { popoverControls } from "@destyler/shared-private"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(popoverControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(popover.machine({ id: id }), {
    context: controls.context,
  })

  const api = $derived(popover.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main class="popover">
    <div data-part="root">
      <button data-testid="button-before">Button :before</button>

      <button data-testid="popover-trigger" {...api.getTriggerProps()}>
        Click me
        <div {...api.getIndicatorProps()}>{">"}</div>
      </button>

      <div {...api.getAnchorProps()}>anchor</div>

      <div use:portal={{ disabled: !api.portalled }} {...api.getPositionerProps()}>
        <div data-testid="popover-content" class="popover-content" {...api.getContentProps()}>
          <div {...api.getArrowProps()}>
            <div {...api.getArrowTipProps()}></div>
          </div>
          <div data-testid="popover-title" {...api.getTitleProps()}>Popover Title</div>
          <div data-part="body" data-testid="popover-body">
            <!-- svelte-ignore a11y_missing_attribute -->
            <a>Non-focusable Link</a>
            <a href="# " data-testid="focusable-link"> Focusable Link </a>
            <input data-testid="input" placeholder="input" />
            <button data-testid="popover-close-button" {...api.getCloseTriggerProps()}> X </button>
          </div>
        </div>
      </div>

      <span data-testid="plain-text">I am just text</span>
      <button data-testid="button-after">Button :after</button>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
