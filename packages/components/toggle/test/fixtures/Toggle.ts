import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as toggle from '../../index'

export class Toggle extends Component<toggle.Context, toggle.Api> {
  initService(context: toggle.Context) {
    return toggle.machine(context)
  }

  initApi() {
    return toggle.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createToggle(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'toggle'
    root.textContent = 'Toggle Component'
    resolve(root)
  })
}
