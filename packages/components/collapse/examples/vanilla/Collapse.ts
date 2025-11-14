import type { ContextFrom } from '@destyler/vanilla'
import type { State as CollapseState } from '../../index'
import { collapseControls, collapseData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as collapse from '../../index'
import '../style.css'

type CollapseMachineContext = ContextFrom<typeof collapse.machine>

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

class CollapseExample extends Component<
  collapse.Context,
  collapse.Api,
  CollapseMachineContext,
  collapse.MachineState
> {
  private readonly items: Array<{
    value: string
    itemEl: HTMLElement
    triggerEl: HTMLButtonElement | null
    contentEl: HTMLElement | null
    indicatorEl: HTMLElement | null
  }>

  private readonly stateListeners = new Set<(state: CollapseState) => void>()

  constructor(rootEl: HTMLElement, context: collapse.Context, options?: any) {
    super(rootEl, context, options)
    this.items = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-collapse-item]')).map(itemEl => ({
      value: itemEl.dataset.value ?? '',
      itemEl,
      triggerEl: itemEl.querySelector<HTMLButtonElement>('[data-collapse-trigger]'),
      contentEl: itemEl.querySelector<HTMLElement>('[data-collapse-content]'),
      indicatorEl: itemEl.querySelector<HTMLElement>('[data-collapse-indicator]'),
    }))
  }

  initService(context: collapse.Context) {
    return collapse.machine(context) as collapse.Service
  }

  initApi() {
    return collapse.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: CollapseState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: CollapseState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const rootProps = this.api.getRootProps()
    spreadProps(this.rootEl, {
      ...rootProps,
      class: classNames('collapse-root', rootProps.class),
    })

    this.items.forEach(({ value, itemEl, triggerEl, contentEl, indicatorEl }) => {
      const itemProps = this.api.getItemProps({ value })
      spreadProps(itemEl, {
        ...itemProps,
        class: classNames('collapse-item', itemProps.class),
      })

      if (triggerEl) {
        const triggerProps = this.api.getItemTriggerProps({ value })
        spreadProps(triggerEl, {
          ...triggerProps,
          class: classNames('collapse-trigger', triggerProps.class),
        })
      }

      if (contentEl) {
        const contentProps = this.api.getItemContentProps({ value })
        spreadProps(contentEl, {
          ...contentProps,
          class: classNames('collapse-content', contentProps.class),
        })
      }

      if (indicatorEl) {
        const indicatorProps = this.api.getItemIndicatorProps({ value })
        spreadProps(indicatorEl, {
          ...indicatorProps,
          class: classNames('collapse-indicator', indicatorProps.class),
        })
      }
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(collapseControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  const itemsMarkup = collapseData
    .map(
      item => `
      <div class="collapse-item" data-collapse-item data-value="${item.id}">
        <h3>
          <button data-testid="${item.id}:trigger" class="collapse-trigger" data-collapse-trigger>
            ${item.title}
            <span class="collapse-indicator" data-collapse-indicator>
              &gt;
            </span>
          </button>
        </h3>
        <div data-testid="${item.id}:content" class="collapse-content" data-collapse-content>
          ${item.content}
        </div>
      </div>
    `,
    )
    .join('')

  layout.main.innerHTML = `
    <div class="collapse-root" data-collapse-root>
      ${itemsMarkup}
    </div>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-collapse-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new CollapseExample(rootEl, { id: 'collapse:vanilla' }, {
    context: {
      get: () => controls.context as Partial<CollapseMachineContext>,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })
  instance.init()

  const updateVisualizer = (state?: CollapseState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as CollapseState)
  instance.onStateChange(updateVisualizer)
}
