<script lang="ts">
  import * as timer from '@destyler/timer'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()

  const [state, send] = useMachine(
    timer.machine({
      id,
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 20, seconds: 1 }),
    })
  )

  const api = $derived(timer.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getAreaProps()}>
    <div {...api.getItemProps({ type: 'days' })} >
      {api.formattedTime.days}
    </div>
    <div {...api.getSeparatorProps()}>
      :
    </div>
    <div {...api.getItemProps({ type: 'hours' })} >
      {api.formattedTime.hours}
    </div>
    <div {...api.getSeparatorProps()} >
      :
    </div>
    <div {...api.getItemProps({ type: 'minutes' })} >
      {api.formattedTime.minutes}
    </div>
    <div {...api.getSeparatorProps()} >
      :
    </div>
    <div {...api.getItemProps({ type: 'seconds' })} >
      {api.formattedTime.seconds}
    </div>
  </div>
</div>

