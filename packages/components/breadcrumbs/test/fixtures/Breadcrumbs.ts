import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as breadcrumbs from '../../index'

export class Breadcrumbs extends Component<breadcrumbs.Context, breadcrumbs.Api> {
  initService(context: breadcrumbs.Context) {
    return breadcrumbs.machine(context)
  }

  initApi() {
    return breadcrumbs.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createBreadcrumbs(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'breadcrumbs'
    root.textContent = 'Breadcrumbs Component'
    resolve(root)
  })
}
