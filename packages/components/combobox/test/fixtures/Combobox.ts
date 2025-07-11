import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as combobox from '../../index'

export class Combobox extends Component<combobox.Context, combobox.Api> {
  initService(context: combobox.Context) {
    return combobox.machine(context)
  }

  initApi() {
    return combobox.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createCombobox(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'combobox'
    root.textContent = 'Combobox Component'
    resolve(root)
  })
}
