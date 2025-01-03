import * as dialog from '@destyler/dialog'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import '../main'

export class Dialog extends Component<dialog.Context, dialog.Api> {
  initService(context: dialog.Context) {
    return dialog.machine(context)
  }

  initApi() {
    return dialog.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    const triggerEL = rootEl.querySelector<HTMLElement>('.trigger')
    if (triggerEL)
      spreadProps(triggerEL, this.api.getTriggerProps())
    const backdropEL = rootEl.querySelector<HTMLElement>('.backdrop')
    if (backdropEL)
      spreadProps(backdropEL, this.api.getBackdropProps())
    const positionerEL = rootEl.querySelector<HTMLElement>('.positioner')
    if (positionerEL)
      spreadProps(positionerEL, this.api.getPositionerProps())
    const contentEL = rootEl.querySelector<HTMLElement>('.content')
    if (contentEL)
      spreadProps(contentEL, this.api.getContentProps())
    const titleEL = rootEl.querySelector<HTMLElement>('.title')
    if (titleEL)
      spreadProps(titleEL, this.api.getTitleProps())
    const descriptionEL = rootEl.querySelector<HTMLElement>('.description')
    if (descriptionEL)
      spreadProps(descriptionEL, this.api.getDescriptionProps())
    const closeTriggerEL = rootEl.querySelector<HTMLElement>('.close-trigger')
    if (closeTriggerEL)
      spreadProps(closeTriggerEL, this.api.getCloseTriggerProps())
  }
}

document.querySelectorAll<HTMLElement>('.dialog-root').forEach((rootEl) => {
  const dialog = new Dialog(rootEl, {
    id: nanoid(),
    preventScroll: true,
    closeOnEscape: true,
    closeOnInteractOutside: false,
    role: 'dialog',
  })
  dialog.init()
})
