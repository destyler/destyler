import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as signature from '../../index'

export class Signature extends Component<signature.Context, signature.Api> {
  initService(context: signature.Context) {
    return signature.machine(context)
  }

  initApi() {
    return signature.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createSignature(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'signature'
    root.textContent = 'Signature Component'
    resolve(root)
  })
}
