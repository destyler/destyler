<script lang="ts">
  import * as separator from '@destyler/separator'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [state, send] = useMachine(separator.machine({ 
    id: crypto.randomUUID(),
    orientation: 'horizontal'
  }))

  const [verticalState, verticalSend] = useMachine(separator.machine({ 
    id: crypto.randomUUID(),
    orientation: 'vertical'
  }))

  $: api = separator.connect($state, send, normalizeProps)
  $: verticalApi = separator.connect($verticalState, verticalSend, normalizeProps)
</script>

<div>
  <div {...api.getRootProps()} style:height="1px" style:background="#e1e5e9" style:margin="15px 0" />
  <div 
    {...verticalApi.getRootProps()} 
    data-testid="vertical-separator"
    style:width="1px" 
    style:height="100px" 
    style:background="#e1e5e9" 
    style:margin="15px"
  />
</div>

<Toolbar>
  <StateVisualizer state={$state} />
</Toolbar>