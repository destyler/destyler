import * as tooltip from '@destyler/tooltip'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import '../main'

export class Tooltip extends Component<tooltip.Context, tooltip.Api> {
  initService(context: tooltip.Context) {
    return tooltip.machine(context)
  }

  initApi() {
    return tooltip.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    const triggerEl = rootEl.querySelector<HTMLElement>('.trigger')
    if (triggerEl)
      spreadProps(triggerEl, this.api.getTriggerProps())
    const positionerEl = rootEl.querySelector<HTMLElement>('.positioner')
    if (positionerEl)
      spreadProps(positionerEl, this.api.getPositionerProps())
    const contentEl = positionerEl?.querySelector<HTMLElement>('.content')
    if (contentEl)
      spreadProps(contentEl, this.api.getContentProps())
  }
}

document.querySelectorAll<HTMLElement>('.tooltip-root').forEach((rootEl) => {
  const tooltip = new Tooltip(rootEl, { id: nanoid() })
  tooltip.init()
})
