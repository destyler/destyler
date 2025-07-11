import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as hoverCard from '../../index'

export class HoverCard extends Component<hoverCard.Context, hoverCard.Api> {
  initService(context: hoverCard.Context) {
    return hoverCard.machine(context)
  }

  initApi() {
    return hoverCard.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createHoverCard(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'hoverCard'
    root.textContent = 'HoverCard Component'
    resolve(root)
  })
}
