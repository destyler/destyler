<script lang="ts">
  import * as switchComponent from '@destyler/switch'
  import { switchControls } from '@destyler/shared-private'
  import { Controls, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const controls = useControls(switchControls)

  const [stateStore, send] = useMachine(switchComponent.machine({ 
    id: crypto.randomUUID(),
    checked: false
  }), {
    context: controls.context,
  })

  const [disabledStateStore, disabledSend] = useMachine(switchComponent.machine({ 
    id: crypto.randomUUID(),
    checked: false,
    disabled: true
  }))

  $: api = switchComponent.connect($stateStore, send, normalizeProps)
  $: disabledApi = switchComponent.connect($disabledStateStore, disabledSend, normalizeProps)
</script>

<div style:display="flex" style:flex-direction="column" style:gap="20px">
  <!-- Regular switch -->
  <div {...api.getRootProps()}>
    <div {...api.getControlProps()} 
         style:width="44px"
         style:height="24px"
         style:border-radius="12px"
         style:background={api.checked ? '#007acc' : '#ccc'}
         style:position="relative"
         style:cursor="pointer"
         style:transition="all 0.2s">
      <div {...api.getThumbProps()} 
           style:width="20px"
           style:height="20px"
           style:border-radius="10px"
           style:background="white"
           style:position="absolute"
           style:top="2px"
           style:left={api.checked ? '22px' : '2px'}
           style:transition="all 0.2s" />
      <input {...api.getHiddenInputProps()} data-testid="hidden-input" />
    </div>
    <div {...api.getLabelProps()}>Switch Label</div>
  </div>

  <!-- Disabled switch -->
  <div {...disabledApi.getRootProps()} data-testid="disabled-switch">
    <div {...disabledApi.getControlProps()} 
         style:width="44px"
         style:height="24px"
         style:border-radius="12px"
         style:background="#e0e0e0"
         style:position="relative"
         style:cursor="not-allowed"
         style:opacity="0.6">
      <div {...disabledApi.getThumbProps()} 
           style:width="20px"
           style:height="20px"
           style:border-radius="10px"
           style:background="white"
           style:position="absolute"
           style:top="2px"
           style:left="2px" />
      <input {...disabledApi.getHiddenInputProps()} data-testid="disabled-input" />
    </div>
    <div {...disabledApi.getLabelProps()}>Disabled Switch</div>
  </div>
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
  <svelte:fragment slot="controls">
    <Controls control={controls} />
  </svelte:fragment>
</Toolbar>