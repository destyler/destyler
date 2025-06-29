<script lang="ts">
  import { highlightState } from "@destyler/stringify"

  interface StateVisualizerProps {
    state: Record<string, any>
    label?: string
    omit?: string[]
  }

  const { label, state: currentState, omit }: StateVisualizerProps = $props()
</script>

<div class="viz">
  <pre>
    <details open>
        <summary>{label || "Visualizer"}</summary>
        <div>{@html highlightState($state.snapshot(currentState), omit)}</div>
    </details>
  </pre>
</div>
