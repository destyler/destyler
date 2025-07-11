import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as menu from '../../index'

export class Menu extends Component<menu.Context, menu.Api> {
  initService(context: menu.Context) {
    return menu.machine(context)
  }

  initApi() {
    return menu.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createMenu(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'menu'
    root.textContent = 'Menu Component'
    resolve(root)
  })
}
