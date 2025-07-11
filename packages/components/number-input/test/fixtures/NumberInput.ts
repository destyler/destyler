import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as numberInput from '../../index'

export class NumberInput extends Component<numberInput.Context, numberInput.Api> {
  initService(context: numberInput.Context) {
    return numberInput.machine(context)
  }

  initApi() {
    return numberInput.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createNumberInput(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'numberInput'
    root.textContent = 'NumberInput Component'
    resolve(root)
  })
}
