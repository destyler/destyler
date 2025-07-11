import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as dynamic from '../../index'

export class Dynamic extends Component<dynamic.Context, dynamic.Api> {
  initService(context: dynamic.Context) {
    return dynamic.machine(context)
  }

  initApi() {
    return dynamic.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createDynamic(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'dynamic'
    root.textContent = 'Dynamic Component'
    resolve(root)
  })
}
