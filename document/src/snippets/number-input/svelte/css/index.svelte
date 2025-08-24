<script lang="ts">
  import * as numberInput from '@destyler/number-input'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()
  
  const [state, send] = useMachine(numberInput.machine({
    id,
    value: '66',
    allowMouseWheel: true,
  }))

  const api = $derived(numberInput.connect(state, send, normalizeProps))
</script>

<div class="number-input" {...api.getRootProps()}>
  <div class="number-input-container">
    <button
      class="number-input-button"
      {...api.getDecrementTriggerProps()}
    >
      <span class="number-input-button-text">-</span>
    </button>
    
    <input
      class="number-input-field"
      {...api.getInputProps()}
    />
    
    <button
      class="number-input-button"
      {...api.getIncrementTriggerProps()}
    >
      <span class="number-input-button-text">+</span>
    </button>
  </div>
</div>
