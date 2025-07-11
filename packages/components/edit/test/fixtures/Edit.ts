import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as edit from '../../index'

export class Edit extends Component<edit.Context, edit.Api> {
  initService(context: edit.Context) {
    return edit.machine(context)
  }

  initApi() {
    return edit.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createEdit(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'edit'
    root.textContent = 'Edit Component'
    resolve(root)
  })
}
