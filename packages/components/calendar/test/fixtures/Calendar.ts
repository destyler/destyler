import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as calendar from '../../index'

export class Calendar extends Component<calendar.Context, calendar.Api> {
  initService(context: calendar.Context) {
    return calendar.machine(context)
  }

  initApi() {
    return calendar.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createCalendar(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'calendar'
    root.textContent = 'Calendar Component'
    resolve(root)
  })
}
