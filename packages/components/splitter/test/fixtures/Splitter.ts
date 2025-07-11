import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as splitter from '../../index'

export class Splitter extends Component<splitter.Context, splitter.Api> {
  initService(context: splitter.Context) {
    return splitter.machine(context)
  }

  initApi() {
    return splitter.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createSplitter(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'splitter'
    root.textContent = 'Splitter Component'
    resolve(root)
  })
}
