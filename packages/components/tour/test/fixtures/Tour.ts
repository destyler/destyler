import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tour from '../../index'

export class Tour extends Component<tour.Context, tour.Api> {
  initService(context: tour.Context) {
    return tour.machine(context)
  }

  initApi() {
    return tour.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createTour(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'tour'
    root.textContent = 'Tour Component'
    resolve(root)
  })
}
