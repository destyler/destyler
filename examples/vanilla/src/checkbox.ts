import * as checkbox from '@destyler/checkbox'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import './main'

export class Checkbox extends Component<checkbox.Context, checkbox.Api> {
  initService(context: checkbox.Context) {
    return checkbox.machine(context)
  }

  initApi() {
    return checkbox.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    spreadProps(this.rootEl, this.api.getRootProps())
    const controlEl = rootEl.querySelector<HTMLElement>('.checkbox-control')
    if (controlEl)
      spreadProps(controlEl, this.api.getControlProps())
    const labelEl = rootEl.querySelector<HTMLElement>('.checkbox-label')
    if (labelEl)
      spreadProps(labelEl, this.api.getLabelProps())
    const inputEl = rootEl.querySelector<HTMLInputElement>('.checkbox-input')
    if (inputEl)
      spreadProps(inputEl, this.api.getHiddenInputProps())
  }
}

document.querySelectorAll<HTMLElement>('.checkbox').forEach((rootEl) => {
  const checkbox = new Checkbox(rootEl, {
    id: nanoid(),
  })

  checkbox.init()
})
