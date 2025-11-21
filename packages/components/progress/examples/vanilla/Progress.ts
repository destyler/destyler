import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as ProgressSnapshot } from '../../src/types'
import { progressControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as progress from '../../index'
import '../style.css'

type ProgressMachineContext = ContextFrom<typeof progress.machine>

class ProgressExample extends Component<
  progress.Context,
  progress.Api<any>,
  ProgressMachineContext,
  MachineState
> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-progress-root]')
  private readonly labelEl = this.rootEl.querySelector<HTMLElement>('[data-progress-label]')
  private readonly circleEl = this.rootEl.querySelector<SVGSVGElement>('[data-progress-circle]')
  private readonly circleTrackEl = this.rootEl.querySelector<SVGCircleElement>('[data-progress-circle-track]')
  private readonly circleRangeEl = this.rootEl.querySelector<SVGCircleElement>('[data-progress-circle-range]')
  private readonly trackEl = this.rootEl.querySelector<HTMLElement>('[data-progress-track]')
  private readonly rangeEl = this.rootEl.querySelector<HTMLElement>('[data-progress-range]')
  private readonly valueTextEl = this.rootEl.querySelector<HTMLElement>('[data-progress-value-text]')
  private readonly decreaseButton = this.rootEl.querySelector<HTMLButtonElement>('[data-progress-decrease]')
  private readonly increaseButton = this.rootEl.querySelector<HTMLButtonElement>('[data-progress-increase]')
  private readonly indeterminateButton = this.rootEl.querySelector<HTMLButtonElement>('[data-progress-indeterminate]')
  private readonly stateListeners = new Set<(state: ProgressSnapshot) => void>()

  constructor(rootEl: HTMLElement, context: progress.Context, options?: any) {
    super(rootEl, context, options)

    this.decreaseButton?.addEventListener('click', () => this.adjustValue(-20))
    this.increaseButton?.addEventListener('click', () => this.adjustValue(20))
    this.indeterminateButton?.addEventListener('click', () => this.api?.setValue(null))
  }

  private adjustValue(delta: number) {
    const current = this.api?.value ?? 0
    this.api?.setValue(current + delta)
  }

  initService(context: progress.Context) {
    return progress.machine(context) as progress.Service
  }

  initApi() {
    return progress.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: ProgressSnapshot) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: ProgressSnapshot) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())

    if (this.circleEl)
      spreadProps(this.circleEl, api.getCircleProps())

    if (this.circleTrackEl)
      spreadProps(this.circleTrackEl, api.getCircleTrackProps())

    if (this.circleRangeEl)
      spreadProps(this.circleRangeEl, api.getCircleRangeProps())

    if (this.trackEl)
      spreadProps(this.trackEl, api.getTrackProps())

    if (this.rangeEl)
      spreadProps(this.rangeEl, api.getRangeProps())

    if (this.valueTextEl) {
      spreadProps(this.valueTextEl, api.getValueTextProps())
      this.valueTextEl.textContent = api.valueAsString
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(progressControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main>
      <div data-progress-example>
        <div data-progress-root>
          <div data-progress-label>Upload progress</div>
          <svg data-progress-circle>
            <circle data-progress-circle-track></circle>
            <circle data-progress-circle-range></circle>
          </svg>
          <div data-progress-track>
            <div data-progress-range></div>
          </div>
          <div data-progress-value-text></div>
          <div data-progress-controls>
            <button type="button" data-progress-decrease>Decrease</button>
            <button type="button" data-progress-increase>Increase</button>
            <button type="button" data-progress-indeterminate>Indeterminate</button>
          </div>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-progress-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new ProgressExample(scope, { id: 'progress:vanilla' }, {
    context: {
      get: () => controls.context as Partial<ProgressMachineContext>,
      subscribe: (fn: (ctx: Partial<ProgressMachineContext>) => void) => controls.subscribe(fn),
    },
  })
  instance.init()

  const updateVisualizer = (state?: ProgressSnapshot) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as ProgressSnapshot)
  instance.onStateChange(updateVisualizer)
}
