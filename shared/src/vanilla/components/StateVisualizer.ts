import { highlightState } from '@destyler/stringify'

export function StateVisualizer(params: { state: any; label?: string; omit?: string[] }): HTMLDivElement {
  const div = document.createElement('div')
  div.className = 'viz'
  const pre = document.createElement('pre')
  const details = document.createElement('details')
  details.open = true
  const summary = document.createElement('summary')
  summary.textContent = params.label || 'Visualizer'
  const content = document.createElement('div')
  content.innerHTML = highlightState(params.state, params.omit)
  details.append(summary, content)
  pre.append(details)
  div.append(pre)
  return div
}
