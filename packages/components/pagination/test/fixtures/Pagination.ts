import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as pagination from '../../index'

export class Pagination extends Component<pagination.Context, pagination.Api> {
  initService(context: pagination.Context) {
    return pagination.machine(context)
  }

  initApi() {
    return pagination.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createPagination(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'pagination'
    root.textContent = 'Pagination Component'
    resolve(root)
  })
}
