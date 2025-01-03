import * as collapsible from '@destyler/collapsible'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'

import { nanoid } from 'nanoid'
import '../main'

export class Collapsible extends Component<collapsible.Context, collapsible.Api> {
  initService(context: collapsible.Context) {
    return collapsible.machine(context)
  }

  initApi() {
    return collapsible.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    spreadProps(this.rootEl, this.api.getRootProps())
    const triggerEl = rootEl.querySelector<HTMLElement>('.collapsible-trigger')
    if (triggerEl)
      spreadProps(triggerEl, this.api.getTriggerProps())
    const contentEl = rootEl.querySelector<HTMLElement>('.collapsible-content')
    if (contentEl)
      spreadProps(contentEl, this.api.getContentProps())
  }
}

document.querySelectorAll<HTMLElement>('.collapsible-root').forEach((rootEl) => {
  const collapsible = new Collapsible(rootEl, { id: nanoid() })
  collapsible.init()
})
