import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tooltip from '../../index'

export class Tooltip extends Component<tooltip.Context, tooltip.Api> {
  initService(context: tooltip.Context) {
    return tooltip.machine(context)
  }

  initApi() {
    return tooltip.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createTooltip(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'tooltip'
    root.textContent = 'Tooltip Component'
    resolve(root)
  })
}
