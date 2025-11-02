<script lang="ts">
  import * as floatingPanel from "../../index"
  import { floatingPanelControls } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(floatingPanelControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(floatingPanel.machine({
    id: id
  }), {
    context: controls.context,
  })

  const api = $derived(floatingPanel.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main class="floating-panel">
    <div>
      <button {...api.getTriggerProps()}>Toggle Panel</button>
      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          <div {...api.getDragTriggerProps()}>
            <div {...api.getHeaderProps()}>
              <p {...api.getTitleProps()}>Floating Panel</p>
              <div data-scope="floating-panel" data-part="trigger-group">
                <button {...api.getMinimizeTriggerProps()}>
                  _
                </button>
                <button {...api.getMaximizeTriggerProps()}>
                  +
                </button>
                <button {...api.getRestoreTriggerProps()}>
                  &#9633;
                </button>
                <button {...api.getCloseTriggerProps()}>
                  x
                </button>
              </div>
            </div>
          </div>
          <div {...api.getBodyProps()}>
            <p>Some content</p>
          </div>

          <div {...api.getResizeTriggerProps({ axis: "n" })}></div>
          <div {...api.getResizeTriggerProps({ axis: "e" })}></div>
          <div {...api.getResizeTriggerProps({ axis: "w" })}></div>
          <div {...api.getResizeTriggerProps({ axis: "s" })}></div>
          <div {...api.getResizeTriggerProps({ axis: "ne" })}></div>
          <div {...api.getResizeTriggerProps({ axis: "se" })}></div>
          <div {...api.getResizeTriggerProps({ axis: "sw" })}></div>
          <div {...api.getResizeTriggerProps({ axis: "nw" })}></div>
        </div>
      </div>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
