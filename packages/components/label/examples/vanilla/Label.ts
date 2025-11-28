import type { State as LabelState } from '../../src/types'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { normalizeProps, spreadProps, useMachine } from '@destyler/vanilla'
import * as label from '../../index'

interface RenderOptions {
  context?: Partial<label.Context>
}

export function render(target: HTMLElement, options: RenderOptions = {}) {
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <label data-label-root>
      text
      <input data-testid="nested-input" aria-label="Nested input" />
    </label>
    <output data-testid="hover-indicator" aria-live="polite">idle</output>
  `

  const rootEl = layout.main.querySelector<HTMLLabelElement>('[data-label-root]')
  const hoverIndicatorEl = layout.main.querySelector<HTMLOutputElement>('[data-testid="hover-indicator"]')
  if (!rootEl)
    return

  const machine = useMachine(
    label.machine({
      id: 'label:vanilla',
      ...options.context,
    }),
  )

  const toolbar = Toolbar()
  layout.root.appendChild(toolbar.root)

  const applyState = (state: LabelState) => {
    const api = label.connect(state, machine.send, normalizeProps)
    spreadProps(rootEl, api.getRootProps())
    if (hoverIndicatorEl)
      hoverIndicatorEl.textContent = api.isHovered ? 'hovered' : 'idle'
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  applyState(machine.state as LabelState)
  machine.service.subscribe(state => applyState(state as LabelState))
}
