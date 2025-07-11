import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as collapse from '../../index'

export class Collapse extends Component<collapse.Context, collapse.Api> {
  initService(context: collapse.Context) {
    return collapse.machine(context)
  }

  initApi() {
    return collapse.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createCollapse(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'collapse'
    root.textContent = 'Collapse Component'
    resolve(root)
  })
}
