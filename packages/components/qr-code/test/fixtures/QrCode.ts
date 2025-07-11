import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as qrCode from '../../index'

export class QrCode extends Component<qrCode.Context, qrCode.Api> {
  initService(context: qrCode.Context) {
    return qrCode.machine(context)
  }

  initApi() {
    return qrCode.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createQrCode(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'qr-code'
    root.textContent = 'QrCode Component'
    resolve(root)
  })
}
