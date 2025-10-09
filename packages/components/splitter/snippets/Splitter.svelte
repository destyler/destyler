<script lang="ts">
  import * as splitter from "@destyler/splitter"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import './style.css'

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

<div {...api.getRootProps()}>
  <div {...api.getPanelProps({ id: 'a' })} class="bg-muted/50">
    <div class="text-center p-12 whitespace-nowrap">
      <p class="text-card-foreground font-semibold text-2xl mb-2">One</p>
    </div>
  </div>
  <div {...api.getResizeTriggerProps({ id: 'a:b' })} class="group">
    <div></div>
    <div></div>
  </div>
  <div {...api.getPanelProps({ id: 'b' })} class="bg-card">
    <div class="text-center p-12 whitespace-nowrap">
      <p class="text-card-foreground font-semibold text-2xl mb-2">Two</p>
    </div>
  </div>
</div>
