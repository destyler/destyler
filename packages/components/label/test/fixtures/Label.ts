import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as label from '../../index'

export class Label extends Component<label.Context, label.Api> {
  initService(context: label.Context) {
    return label.machine(context)
  }

  initApi() {
    return label.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createLabel(): Promise<HTMLLabelElement> {
  return new Promise((resolve) => {
    const root = document.createElement('label')
    root.className = 'label'
    root.textContent = 'Test Label'
    resolve(root)
  })
}
