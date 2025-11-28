import type { ContextFrom } from '@destyler/vanilla'
import type { State as StepsState } from '../../src/types'
import { stepsControls, stepsData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as steps from '../../index'
import '../style.css'

interface StepRefs {
  item: HTMLElement | null
  trigger: HTMLButtonElement | null
  indicator: HTMLElement | null
  indicatorLabel: HTMLElement | null
  separator: HTMLElement | null
  content: HTMLElement | null
}

type StepsMachineContext = ContextFrom<typeof steps.machine>
type StepsSnapshot = Parameters<typeof steps.connect>[0]

class StepsExample extends Component<steps.Context, steps.Api, StepsMachineContext> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-steps-root]')
  private readonly listEl = this.rootEl.querySelector<HTMLElement>('[data-steps-list]')
  private readonly stepRefs: StepRefs[] = stepsData.map((_, index) => ({
    item: this.rootEl.querySelector(`[data-steps-item="${index}"]`),
    trigger: this.rootEl.querySelector(`[data-steps-trigger="${index}"]`),
    indicator: this.rootEl.querySelector(`[data-steps-indicator="${index}"]`),
    indicatorLabel: this.rootEl.querySelector(`[data-steps-indicator-label="${index}"]`),
    separator: this.rootEl.querySelector(`[data-steps-separator="${index}"]`),
    content: this.rootEl.querySelector(`[data-steps-content="${index}"]`),
  }))

  private readonly completeContentEl = this.rootEl.querySelector<HTMLElement>('[data-steps-content="complete"]')
  private readonly prevButton = this.rootEl.querySelector<HTMLButtonElement>('[data-steps-prev]')
  private readonly nextButton = this.rootEl.querySelector<HTMLButtonElement>('[data-steps-next]')
  private readonly stateListeners = new Set<(state: StepsState) => void>()

  initService(context: steps.Context) {
    return steps.machine(context)
  }

  initApi() {
    return steps.connect(this.service.state as StepsSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: StepsState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: StepsState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.listEl)
      spreadProps(this.listEl, api.getListProps())

    this.stepRefs.forEach((refs, index) => {
      if (refs.item)
        spreadProps(refs.item, api.getItemProps({ index }))
      if (refs.trigger)
        spreadProps(refs.trigger, api.getTriggerProps({ index }))
      if (refs.indicator)
        spreadProps(refs.indicator, api.getIndicatorProps({ index }))
      if (refs.indicatorLabel)
        refs.indicatorLabel.textContent = String(index + 1)
      if (refs.separator)
        spreadProps(refs.separator, api.getSeparatorProps({ index }))
      if (refs.content)
        spreadProps(refs.content, api.getContentProps({ index }))
    })

    if (this.completeContentEl)
      spreadProps(this.completeContentEl, api.getContentProps({ index: stepsData.length }))

    if (this.prevButton)
      spreadProps(this.prevButton, api.getPrevTriggerProps())

    if (this.nextButton)
      spreadProps(this.nextButton, api.getNextTriggerProps())
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(stepsControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  const listMarkup = stepsData
    .map((step, index) => `
      <div data-steps-item="${index}">
        <button type="button" data-steps-trigger="${index}">
          <div data-steps-indicator="${index}">
            <span data-steps-indicator-label="${index}">${index + 1}</span>
          </div>
          <span>${step.title}</span>
        </button>
        <div data-steps-separator="${index}"></div>
      </div>
    `)
    .join('')

  const contentMarkup = stepsData
    .map((step, index) => `
      <div data-steps-content="${index}">
        <strong>${step.title}</strong> - ${step.description}
      </div>
    `)
    .join('')

  layout.main.innerHTML = `
    <main class="steps">
      <div data-steps-example>
        <div data-steps-root>
          <div data-steps-list>
            ${listMarkup}
          </div>

          <div data-steps-panel-group>
            ${contentMarkup}
            <div data-steps-content="complete">
              Steps Complete - Thank you for filling out the form!
            </div>
          </div>

          <div data-steps-nav>
            <button type="button" data-steps-prev>Back</button>
            <button type="button" data-steps-next>Next</button>
          </div>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-steps-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new StepsExample(scope, { id: 'steps:vanilla', count: stepsData.length }, {
    context: {
      get: () => controls.context as Partial<StepsMachineContext>,
      subscribe: (fn: (ctx: Partial<StepsMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: StepsState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as StepsState)
  instance.onStateChange(updateVisualizer)
}
