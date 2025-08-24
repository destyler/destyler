<script lang="ts">
  import * as splitter from "@destyler/splitter"
  import { normalizeProps, useMachine } from "@destyler/svelte"


  const [state, send] = useMachine(
    splitter.machine({
      id: crypto.randomUUID(),
      size: [
        { id: "a", size: 30, minSize: 15 },
        { id: "b", size: 70, minSize: 0 },
      ]
    })
  )

  const api = $derived(splitter.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="splitter-root">
  <div {...api.getPanelProps({ id: 'a' })} class="splitter-panel-a">
    <div class="splitter-panel-content">
      <p class="splitter-panel-text">One</p>
    </div>
  </div>
  <div
    {...api.getResizeTriggerProps({ id: 'a:b' })}
    class="splitter-resize-trigger"
  >
    <div class="splitter-resize-handle"></div>
    <div class="splitter-resize-area"></div>
  </div>
  <div {...api.getPanelProps({ id: 'b' })} class="splitter-panel-b">
    <div class="splitter-panel-content">
      <p class="splitter-panel-text">Two</p>
    </div>
  </div>
</div>

<style>
  .cursor-col-resize {
    cursor: col-resize;
  }
</style>
