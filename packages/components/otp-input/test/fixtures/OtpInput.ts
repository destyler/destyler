import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as otpInput from '../../index'

export class OtpInput extends Component<otpInput.Context, otpInput.Api> {
  initService(context: otpInput.Context) {
    return otpInput.machine(context)
  }

  initApi() {
    return otpInput.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createOtpInput(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'otpInput'
    root.textContent = 'OtpInput Component'
    resolve(root)
  })
}
