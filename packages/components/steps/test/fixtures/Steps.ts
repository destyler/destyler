import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as steps from '../../index'

export class Steps extends Component<steps.Context, steps.Api> {
  initService(context: steps.Context) {
    return steps.machine(context)
  }

  initApi() {
    return steps.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createSteps(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'steps'
    root.textContent = 'Steps Component'
    resolve(root)
  })
}
