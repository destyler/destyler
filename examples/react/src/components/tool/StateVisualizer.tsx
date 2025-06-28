import { highlightState } from '@destyler/stringify'

interface StateVisualizerProps {
  state: any
  label?: string
  omit?: string[]
}

export function StateVisualizer({ state, label, omit }: StateVisualizerProps) {
  return (
    <div className="viz">
      <pre>
        <details open>
          <summary>{label || 'Visualizer'}</summary>
          <div dangerouslySetInnerHTML={{ __html: highlightState(state, omit) }} />
        </details>
      </pre>
    </div>
  )
}
