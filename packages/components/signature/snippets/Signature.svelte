<script lang="ts">
  import * as signature from "@destyler/signature"
  import { useMachine, normalizeProps } from "@destyler/svelte"
  import './style.css'

  const id = $props.id()
  const [state, send] = useMachine(signature.machine({ id }))

  const api = $derived(signature.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div class="space-y-2">
    <label {...api.getLabelProps()}>
      Signature
    </label>
    <p class="text-sm text-muted-foreground mt-0!">
      Draw your signature in the area below
    </p>
  </div>

  <div {...api.getControlProps()}>
    <svg {...api.getSegmentProps()}>
      {#each api.paths as path, i}
        <path
          {...api.getSegmentPathProps({ path })}
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {/each}
      {#if api.currentPath}
        <path
          {...api.getSegmentPathProps({ path: api.currentPath })}
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {/if}
    </svg>
    <button {...api.getClearTriggerProps()}>
      <span></span>
      <span>Clear signature</span>
    </button>
    <div {...api.getGuideProps()}>
      Sign above
    </div>
  </div>
  <div class="flex items-center justify-between mt-0!">
    <p class="text-xs text-muted-foreground mt-0!">
      {api.paths.length} stroke{api.paths.length !== 1 ? 's' : ''}
    </p>
  </div>
</div>
