import * as menu from '@destyler/menu'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import '../main'

export class Menu extends Component<menu.Context, menu.Api> {
  initService(context: menu.Context) {
    return menu.machine(context)
  }

  initApi() {
    return menu.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    const triggerEl = rootEl.querySelector<HTMLElement>('.trigger')
    if (triggerEl)
      spreadProps(triggerEl, this.api.getTriggerProps())
    const positionerEl = rootEl.querySelector<HTMLElement>('.positioner')
    if (positionerEl)
      spreadProps(positionerEl, this.api.getPositionerProps())
    const contentEl = rootEl.querySelector<HTMLElement>('.content')
    if (contentEl)
      spreadProps(contentEl, this.api.getContentProps())
    this.items.forEach((itemEl) => {
      this.renderItem(itemEl)
    })
  }

  private get items() {
    return Array.from(this.rootEl!.querySelectorAll<HTMLElement>('.item'))
  }

  private renderItem = (itemEl: HTMLElement) => {
    const value = itemEl.dataset.value
    if (!value)
      throw new Error('Expected value to be defined')
    spreadProps(itemEl, this.api.getItemProps({ value }))
  }
}

document.querySelectorAll<HTMLElement>('.menu-root').forEach((rootEl) => {
  const menu = new Menu(rootEl, { id: nanoid() })
  menu.init()
})
