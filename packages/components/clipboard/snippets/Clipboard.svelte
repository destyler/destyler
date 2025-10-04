<script lang="ts">
  import * as clipboard from '@destyler/clipboard'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()

  const [state, send] = useMachine(
    clipboard.machine({
      id: id,
      value: 'https://github.com/destyler/destyler',
    })
  )

  const api = $derived(clipboard.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <label {...api.getLabelProps()}>
    Copy Link
  </label>
  <div {...api.getControlProps()} >
    <input {...api.getInputProps()} readonly />
    <button {...api.getTriggerProps()} >
      <div></div>
    </button>
  </div>
</div>
