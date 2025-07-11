import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as select from '../../index'

export class Select extends Component<select.Context, select.Api> {
  initService(context: select.Context) {
    return select.machine(context)
  }

  initApi() {
    return select.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createSelect(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'select'
    root.textContent = 'Select Component'
    resolve(root)
  })
}
