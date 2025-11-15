import type { ContextFrom } from '@destyler/vanilla'
import type { State as AspectRatioState } from '../../index'
import { aspectRatioControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as aspectRatio from '../../index'
import '../style.css'

type AspectRatioMachineContext = ContextFrom<typeof aspectRatio.machine>

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

class AspectRatioExample extends Component<
  aspectRatio.Context,
  aspectRatio.Api,
  AspectRatioMachineContext,
  aspectRatio.MachineState
> {
  private readonly rootNode: HTMLElement | null
  private readonly contentNode: HTMLElement | null
  private readonly stateListeners = new Set<(state: AspectRatioState) => void>()

  constructor(rootEl: HTMLElement, context: aspectRatio.Context, options?: any) {
    super(rootEl, context, options)
    this.rootNode = rootEl.querySelector<HTMLElement>('[data-aspect-root]')
    this.contentNode = rootEl.querySelector<HTMLElement>('[data-aspect-content]')
  }

  initService(context: aspectRatio.Context) {
    return aspectRatio.machine(context) as aspectRatio.Service
  }

  initApi() {
    return aspectRatio.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: AspectRatioState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: AspectRatioState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    if (this.rootNode) {
      const props = this.api.getRootProps()
      spreadProps(this.rootNode, {
        ...props,
        class: classNames('aspect-ratio-node', props.class),
      })
    }

    if (this.contentNode) {
      const props = this.api.getContentProps()
      spreadProps(this.contentNode, {
        ...props,
        class: classNames('aspect-ratio-content', props.class),
      })
    }
  }
}

export function render(target: HTMLElement, ratio = 16 / 9) {
  const controls = useControls(aspectRatioControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div class="aspect-ratio-root" data-aspect-scope>
      <div class="aspect-ratio-node" data-aspect-root>
        <div class="aspect-ratio-content" data-aspect-content>
          <img
            class="aspect-ratio-img"
            src="https://elonehoo.me/gallery/20_sun.jpg"
          >
        </div>
      </div>
    </div>
  `

  const scopeEl = layout.main.querySelector<HTMLElement>('[data-aspect-scope]')
  if (!scopeEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new AspectRatioExample(scopeEl, { id: 'aspect-ratio:vanilla', ratio }, {
    context: {
      get: () => controls.context,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })
  instance.init()

  const updateVisualizer = (state?: AspectRatioState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as AspectRatioState)
  instance.onStateChange(updateVisualizer)
}
