<script lang="ts">
  import * as numberInput from '@destyler/number-input'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '@docs/styles/components/number-input.css'

  const id = $props.id()

  const [state, send] = useMachine(numberInput.machine({
    id,
    value: '66',
    allowMouseWheel: true,
  }))

  const api = $derived(numberInput.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <button {...api.getDecrementTriggerProps()}>
    <span>-</span>
  </button>
  <input {...api.getInputProps()}/>
  <button {...api.getIncrementTriggerProps()}>
    <span>+</span>
  </button>
</div>
