import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as presence from '../../index'

export class Presence extends Component<presence.Context, presence.Api> {
  initService(context: presence.Context) {
    return presence.machine(context)
  }

  initApi() {
    return presence.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createPresence(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'presence'
    root.textContent = 'Presence Component'
    resolve(root)
  })
}
