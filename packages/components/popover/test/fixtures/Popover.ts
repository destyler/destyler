import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as popover from '../../index'

export class Popover extends Component<popover.Context, popover.Api> {
  initService(context: popover.Context) {
    return popover.machine(context)
  }

  initApi() {
    return popover.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createPopover(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'popover'
    root.textContent = 'Popover Component'
    resolve(root)
  })
}
