import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tabs from '../../index'

export class Tabs extends Component<tabs.Context, tabs.Api> {
  initService(context: tabs.Context) {
    return tabs.machine(context)
  }

  initApi() {
    return tabs.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createTabs(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'tabs'
    root.textContent = 'Tabs Component'
    resolve(root)
  })
}
