import * as collapse from '@destyler/collapse'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import '../main'

export class Collapse extends Component<collapse.Context, collapse.Api> {
  initService(context: collapse.Context) {
    return collapse.machine(context)
  }

  initApi() {
    return collapse.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.items.forEach((itemEl) => {
      this.renderItem(itemEl)
    })
  }

  private get items() {
    return Array.from(this.rootEl!.querySelectorAll<HTMLElement>('.collapse-item'))
  }

  private renderItem = (itemEl: HTMLElement) => {
    const value = itemEl.dataset.value
    if (!value)
      throw new Error('Expected value to be defined')
    const itemTriggerEl = itemEl.querySelector<HTMLButtonElement>('.collapse-trigger')
    const itemContentEl = itemEl.querySelector<HTMLElement>('.collapse-content')
    if (!itemTriggerEl)
      throw new Error('Expected triggerEl to be defined')
    if (!itemContentEl)
      throw new Error('Expected contentEl to be defined')
    spreadProps(itemEl, this.api.getItemProps({ value }))
    spreadProps(itemTriggerEl, this.api.getItemTriggerProps({ value }))
    spreadProps(itemContentEl, this.api.getItemContentProps({ value }))
  }
}

document.querySelectorAll<HTMLElement>('.collapse').forEach((rootEl) => {
  const collapse = new Collapse(rootEl, { id: nanoid() })
  collapse.init()
})
