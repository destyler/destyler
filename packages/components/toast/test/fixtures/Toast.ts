import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as toast from '../../index'

export class Toast extends Component<toast.Context, toast.Api> {
  initService(context: toast.Context) {
    return toast.machine(context)
  }

  initApi() {
    return toast.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createToast(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'toast'
    root.textContent = 'Toast Component'
    resolve(root)
  })
}
