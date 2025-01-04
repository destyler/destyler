import * as switchs from '@destyler/switch'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import '../main'

export class Image extends Component<switchs.Context, switchs.Api> {
  initService(context: switchs.Context) {
    return switchs.machine(context)
  }

  initApi() {
    return switchs.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    spreadProps(this.rootEl, this.api.getRootProps())
    const hiddenInputEl = rootEl.querySelector<HTMLElement>('.hidden-input')
    if (hiddenInputEl)
      spreadProps(hiddenInputEl, this.api.getHiddenInputProps())
    const controlEl = rootEl.querySelector<HTMLElement>('.control')
    if (controlEl)
      spreadProps(controlEl, this.api.getControlProps())
    const thumbEl = rootEl.querySelector<HTMLElement>('.thumb')
    if (thumbEl)
      spreadProps(thumbEl, this.api.getThumbProps())
    const labelEl = rootEl.querySelector<HTMLElement>('.label')
    if (labelEl)
      spreadProps(labelEl, this.api.getLabelProps())
  }
}

document.querySelectorAll<HTMLElement>('.switch-root').forEach((rootEl) => {
  const switchs = new Image(rootEl, { id: nanoid() })
  switchs.init()
})
