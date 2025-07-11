import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as clipboard from '../../index'

export class Clipboard extends Component<clipboard.Context, clipboard.Api> {
  initService(context: clipboard.Context) {
    return clipboard.machine(context)
  }

  initApi() {
    return clipboard.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createClipboard(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'clipboard'
    root.textContent = 'Clipboard Component'
    resolve(root)
  })
}
