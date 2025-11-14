import type { ContextFrom } from '@destyler/vanilla'
import { collapsibleControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import type { State as CollapsibleState } from '../../index'
import * as collapsible from '../../index'
import '../style.css'

type CollapsibleMachineContext = ContextFrom<typeof collapsible.machine>

const sampleText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat.
`

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

class CollapsibleExample extends Component<
  collapsible.Context,
  collapsible.Api,
  CollapsibleMachineContext,
  collapsible.MachineState
> {
  private readonly triggerEl: HTMLButtonElement | null
  private readonly contentEl: HTMLElement | null
  private readonly stateListeners = new Set<(state: CollapsibleState) => void>()

  constructor(rootEl: HTMLElement, context: collapsible.Context, options?: any) {
    super(rootEl, context, options)
    this.triggerEl = rootEl.querySelector<HTMLButtonElement>('[data-collapsible-trigger]')
    this.contentEl = rootEl.querySelector<HTMLElement>('[data-collapsible-content]')
  }

  initService(context: collapsible.Context) {
    return collapsible.machine(context) as collapsible.Service
  }

  initApi() {
    return collapsible.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: CollapsibleState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: CollapsibleState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const rootProps = this.api.getRootProps()
    spreadProps(this.rootEl, {
      ...rootProps,
      class: classNames('collapsible-root', rootProps.class),
    })

    if (this.triggerEl) {
      const triggerProps = this.api.getTriggerProps()
      spreadProps(this.triggerEl, {
        ...triggerProps,
        class: classNames('collapsible-trigger', triggerProps.class),
      })
    }

    if (this.contentEl) {
      const contentProps = this.api.getContentProps()
      spreadProps(this.contentEl, {
        ...contentProps,
        class: classNames('collapsible-content', contentProps.class),
      })
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(collapsibleControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div class="collapsible-root" data-collapsible-root>
      <button class="collapsible-trigger" data-collapsible-trigger>
        Collapsible Trigger
      </button>
      <div class="collapsible-content" data-collapsible-content>
        <p>${sampleText}</p>
      </div>
    </div>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-collapsible-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new CollapsibleExample(rootEl, { id: 'collapsible:vanilla' }, {
    context: {
      get: () => controls.context as Partial<CollapsibleMachineContext>,
      subscribe: fn => controls.subscribe(fn),
    },
  })
  instance.init()

  const updateVisualizer = (state?: CollapsibleState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as CollapsibleState)
  instance.onStateChange(updateVisualizer)
}
