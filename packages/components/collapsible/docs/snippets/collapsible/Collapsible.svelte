<script lang="ts">
  import * as collapsible from '@destyler/collapsible'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '@docs/styles/components/collapsible.css'

  const id = $props.id()

  const [state, send] = useMachine(collapsible.machine({ id }))

  const api = $derived(collapsible.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div>
    <h4>@elonehoo starred 3 repositories</h4>
    <button {...api.getTriggerProps()}>
      <div></div>
    </button>
  </div>

  <div>@destyler/collapsible</div>

  <div {...api.getContentProps()}>
    <div>@destyler/svelte</div>
    <div>svelte</div>
  </div>
</div>
