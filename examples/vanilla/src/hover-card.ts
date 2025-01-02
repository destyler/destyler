import * as hoverCard from '@destyler/hover-card'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import './main'

export class HoverCard extends Component<hoverCard.Context, hoverCard.Api> {
  initService(context: hoverCard.Context) {
    return hoverCard.machine(context)
  }

  initApi() {
    return hoverCard.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    const triggerEl = rootEl.querySelector<HTMLElement>('.trigger')
    if (triggerEl)
      spreadProps(triggerEl, this.api.getTriggerProps())
    const positionerEl = rootEl.querySelector<HTMLElement>('.positioner')
    if (positionerEl)
      spreadProps(positionerEl, this.api.getPositionerProps())
    const contentEl = rootEl.querySelector<HTMLElement>('.content')
    if (contentEl)
      spreadProps(contentEl, this.api.getContentProps())
  }
}

document.querySelectorAll<HTMLElement>('.hover-card-root').forEach((rootEl) => {
  const hoverCard = new HoverCard(rootEl, { id: nanoid() })
  hoverCard.init()
})
