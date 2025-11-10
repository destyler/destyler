<script lang="ts">
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import * as timer from "../../index"
  import '../style.css'

  const [snapshot, send] = useMachine(
    timer.machine({
      id: "s1",
      countdown: true,
      autoStart: true,
      startMs: timer.parse({ days: 2, seconds: 10 }),
      onComplete() {
        console.log("Timer completed")
      },
    }),
  )

  const api = $derived(timer.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main class="timer">
    <div {...api.getRootProps()}>
      <div {...api.getAreaProps()}>
        <div {...api.getItemProps({ type: "days" })}>{api.formattedTime.days}</div>
        <div {...api.getSeparatorProps()}>:</div>
        <div {...api.getItemProps({ type: "hours" })}>{api.formattedTime.hours}</div>
        <div {...api.getSeparatorProps()}>:</div>
        <div {...api.getItemProps({ type: "minutes" })}>{api.formattedTime.minutes}</div>
        <div {...api.getSeparatorProps()}>:</div>
        <div {...api.getItemProps({ type: "seconds" })}>{api.formattedTime.seconds}</div>
      </div>

      <div {...api.getControlProps()}>
        <button {...api.getActionTriggerProps({ action: "start" })}>START</button>
        <button {...api.getActionTriggerProps({ action: "pause" })}>PAUSE</button>
        <button {...api.getActionTriggerProps({ action: "resume" })}>RESUME</button>
        <button {...api.getActionTriggerProps({ action: "reset" })}>RESET</button>
      </div>
    </div>
  </main>

  <Toolbar controls={null} viz>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
