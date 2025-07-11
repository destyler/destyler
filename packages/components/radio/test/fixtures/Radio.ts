import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as radio from '../../index'

export class Radio extends Component<radio.Context, radio.Api> {
  initService(context: radio.Context) {
    return radio.machine(context)
  }

  initApi() {
    return radio.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createRadio(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'radio'
    root.textContent = 'Radio Component'
    resolve(root)
  })
}
