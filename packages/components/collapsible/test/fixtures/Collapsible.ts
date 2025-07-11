import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as collapsible from '../../index'

export class Collapsible extends Component<collapsible.Context, collapsible.Api> {
  initService(context: collapsible.Context) {
    return collapsible.machine(context)
  }

  initApi() {
    return collapsible.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createCollapsible(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'collapsible'
    root.textContent = 'Collapsible Component'
    resolve(root)
  })
}
