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

<div {...api.getRootProps()} class="w-full min-w-xl rounded-lg bg-background shadow-lg overflow-hidden">
  <div {...api.getPanelProps({ id: 'a' })} class="bg-muted/50 flex items-center justify-center h-full">
    <div class="text-center p-12 whitespace-nowrap">
      <p class="text-card-foreground font-semibold text-2xl mb-2">One</p>
    </div>
  </div>
  <div
    {...api.getResizeTriggerProps({ id: 'a:b' })}
    class="group w-1 mt-0! bg-border hover:bg-primary/20 
    cursor-col-resize transition-all duration-200 flex items-center 
    justify-center relative outline-none focus:outline-none"
  >
    <div class="w-1 h-12 group-focus:h-16 bg-muted-foreground/40 rounded-full group-focus:bg-primary transition-all duration-200" ></div>
    <div class="absolute inset-0 w-4 -mx-1.5" ></div>
  </div>
  <div {...api.getPanelProps({ id: 'b' })} class="mt-0! bg-card flex items-center justify-center h-full">
    <div class="text-center p-12 whitespace-nowrap">
      <p class="text-card-foreground font-semibold text-2xl mb-2">Two</p>
    </div>
  </div>
</div>

<style>
  .cursor-col-resize {
    cursor: col-resize;
  }
</style>
