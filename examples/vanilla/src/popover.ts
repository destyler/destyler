import * as popover from '@destyler/popover'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import './main'

export class Popover extends Component<popover.Context, popover.Api> {
  initService(context: popover.Context) {
    return popover.machine(context)
  }

  initApi() {
    return popover.connect(this.service.state, this.service.send, normalizeProps)
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
    const titleEl = rootEl.querySelector<HTMLElement>('.title')
    if (titleEl)
      spreadProps(titleEl, this.api.getTitleProps())
    const descriptionEl = rootEl.querySelector<HTMLElement>('.description')
    if (descriptionEl)
      spreadProps(descriptionEl, this.api.getDescriptionProps())
    const closeTriggerEl = rootEl.querySelector<HTMLElement>('.close-trigger')
    if (closeTriggerEl)
      spreadProps(closeTriggerEl, this.api.getCloseTriggerProps())
  }
}

document.querySelectorAll<HTMLElement>('.popover-root').forEach((rootEl) => {
  const popover = new Popover(rootEl, { id: nanoid() })
  popover.init()
})
