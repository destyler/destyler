import type { ContextFrom } from '@destyler/vanilla'
import { collapseData } from '@destyler/shared-private'
import { Component, hydrateSpreadProps, normalizeProps, spreadProps } from '@destyler/vanilla'
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
  initService(context: collapse.Context) {
    return collapse.machine(context) as collapse.Service
  }

  initApi() {
    return collapse.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    if (!this.rootEl)
      return
    const rootProps = this.api.getRootProps()
    spreadProps(this.rootEl, {
      ...rootProps,
      class: classNames('collapse-root', rootProps.class),
    })

    const itemsMarkup = collapseData
      .map((item) => {
        const itemProps = this.api.getItemProps({ value: item.id })
        const triggerProps = this.api.getItemTriggerProps({ value: item.id })
        const contentProps = this.api.getItemContentProps({ value: item.id })
        const indicatorProps = this.api.getItemIndicatorProps({ value: item.id })

        return `
          <div class="collapse-item" ${spreadProps({
            ...itemProps,
            'class': classNames('collapse-item', itemProps.class),
            'data-value': item.id,
          })}>
            <h3>
              <button class="collapse-trigger" ${spreadProps({
                ...triggerProps,
                class: classNames('collapse-trigger', triggerProps.class),
              })}>
                ${item.title}
                <span class="collapse-indicator" ${spreadProps({
                  ...indicatorProps,
                  class: classNames('collapse-indicator', indicatorProps.class),
                })}>
                  &gt;
                </span>
              </button>
            </h3>
            <div class="collapse-content" ${spreadProps({
              ...contentProps,
              class: classNames('collapse-content', contentProps.class),
            })}>
              ${item.content}
            </div>
          </div>
        `
      })
      .join('')

    this.rootEl.innerHTML = itemsMarkup
    hydrateSpreadProps(this.rootEl)
  }
}

export function render(target: HTMLElement) {
  target.innerHTML = `
    <div data-collapse-root></div>
  `

  const rootEl = target.querySelector<HTMLElement>('[data-collapse-root]')
  if (!rootEl)
    return

  const instance = new CollapseExample(rootEl, { id: 'collapse:vanilla' })
  instance.init()
}
