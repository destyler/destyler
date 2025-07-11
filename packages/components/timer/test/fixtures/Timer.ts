import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as timer from '../../index'

export class Timer extends Component<timer.Context, timer.Api> {
  initService(context: timer.Context) {
    return timer.machine(context)
  }

  initApi() {
    return timer.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createTimer(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'timer'
    root.textContent = 'Timer Component'
    resolve(root)
  })
}
