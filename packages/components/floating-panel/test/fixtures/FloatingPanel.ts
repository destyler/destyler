import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as floatingPanel from '../../index'

export class FloatingPanel extends Component<floatingPanel.Context, floatingPanel.Api> {
  initService(context: floatingPanel.Context) {
    return floatingPanel.machine(context)
  }

  initApi() {
    return floatingPanel.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createFloatingPanel(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'floating-panel'
    root.textContent = 'FloatingPanel Component'
    resolve(root)
  })
}
