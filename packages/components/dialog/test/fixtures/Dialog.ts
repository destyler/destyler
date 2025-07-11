import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as dialog from '../../index'

export class Dialog extends Component<dialog.Context, dialog.Api> {
  initService(context: dialog.Context) {
    return dialog.machine(context)
  }

  initApi() {
    return dialog.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createDialog(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'dialog'
    root.textContent = 'Dialog Component'
    resolve(root)
  })
}
