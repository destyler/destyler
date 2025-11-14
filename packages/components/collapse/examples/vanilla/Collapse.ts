import type { ContextFrom } from '@destyler/vanilla'
import { collapseData } from '@destyler/shared-private'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as collapse from '../../index'
import '../style.css'

type CollapseMachineContext = ContextFrom<typeof collapse.machine>

class CollapseExample extends Component<
  collapse.Context,
  collapse.Api,
  CollapseMachineContext,
  collapse.MachineState
> {
  initService(context: collapse.Context) {
    return collapse.machine(context) as collapse.Service
  }

  initApi() {
    return collapse.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    if (!this.rootEl)
      return

    spreadProps(this.rootEl, this.api.getRootProps())

    const itemNodes = Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-collapse-item]'))
    itemNodes.forEach((itemEl) => {
      const value = itemEl.dataset.value
      if (!value)
        return

      const triggerEl = itemEl.querySelector<HTMLButtonElement>('[data-collapse-trigger]')
      const contentEl = itemEl.querySelector<HTMLElement>('[data-collapse-content]')
      const indicatorEl = itemEl.querySelector<HTMLElement>('[data-collapse-indicator]')

      spreadProps(itemEl, this.api.getItemProps({ value }))
      if (triggerEl)
        spreadProps(triggerEl, this.api.getItemTriggerProps({ value }))
      if (contentEl)
        spreadProps(contentEl, this.api.getItemContentProps({ value }))
      if (indicatorEl)
        spreadProps(indicatorEl, this.api.getItemIndicatorProps({ value }))
    })
  }
}

export function render(target: HTMLElement) {
  const itemsMarkup = collapseData
    .map(
      item => `
      <div class="collapse-item" data-collapse-item data-value="${item.id}">
        <h3>
          <button class="collapse-trigger" data-collapse-trigger>
            ${item.title}
            <span class="collapse-indicator" data-collapse-indicator>
              &gt;
            </span>
          </button>
        </h3>
        <div class="collapse-content" data-collapse-content>
          ${item.content}
        </div>
      </div>
    `,
    )
    .join('')

  target.innerHTML = `
    <div class="collapse-root" data-collapse-root>
      ${itemsMarkup}
    </div>
  `

  const rootEl = target.querySelector<HTMLElement>('[data-collapse-root]')
  if (!rootEl)
    return

  const instance = new CollapseExample(rootEl, { id: 'collapse:vanilla' })
  instance.init()
}
