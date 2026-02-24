import type { MachineState, MachineContext as SeparatorMachineContext, State as SeparatorSnapshot } from '../../src/types'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as separator from '../../index'
import '../style.css'

type SeparatorRenderOptions = Partial<separator.Context>

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

class SeparatorExample extends Component<
  separator.Context,
  separator.Api,
  SeparatorMachineContext,
  MachineState
> {
  private readonly horizontal: HTMLElement | null
  private readonly verticals: HTMLElement[]
  private readonly stateListeners = new Set<(state: SeparatorSnapshot) => void>()

  constructor(rootEl: HTMLElement, context: separator.Context, options?: any) {
    super(rootEl, context, options)
    this.horizontal = rootEl.querySelector<HTMLElement>('[data-separator-horizontal]')
    this.verticals = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-separator-vertical]'))
  }

  initService(context: separator.Context) {
    return separator.machine(context)
  }

  initApi() {
    return separator.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: SeparatorSnapshot) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: SeparatorSnapshot) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    if (this.horizontal) {
      const props = this.api.getRootProps()
      spreadProps(this.horizontal, {
        ...props,
        class: classNames('separator-line separator-example__divider', props.class),
      })
    }

    this.verticals.forEach((node) => {
      const props = this.api.getRootProps('vertical')
      spreadProps(node, {
        ...props,
        class: classNames('separator-line separator-example__divider--vertical', props.class),
      })
    })
  }
}

export function render(target: HTMLElement, context: SeparatorRenderOptions = {}) {
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <section class="separator-example" data-separator-example>
      <header class="separator-example__header">
        <p class="separator-example__title">Destyler</p>
        <p class="separator-example__subtitle">Unstyled components for Vanilla JS.</p>
      </header>
      <div data-separator-horizontal></div>
      <nav class="separator-example__nav" aria-label="Secondary">
        <span class="separator-example__nav-item">Blog</span>
        <div data-separator-vertical></div>
        <span class="separator-example__nav-item">Docs</span>
        <div data-separator-vertical></div>
        <span class="separator-example__nav-item">Source</span>
      </nav>
    </section>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-separator-example]')
  if (!scope)
    return

  const toolbar = Toolbar({ active: 'visualizer' })
  layout.root.appendChild(toolbar.root)

  const instance = new SeparatorExample(scope, {
    id: 'separator:vanilla',
    ...context,
  })
  instance.init()

  const updateVisualizer = (state?: SeparatorSnapshot) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as SeparatorSnapshot)
  instance.onStateChange(updateVisualizer)
}
