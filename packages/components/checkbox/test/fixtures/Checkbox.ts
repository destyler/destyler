import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as checkbox from '../../index'

export class Checkbox extends Component<checkbox.Context, checkbox.Api> {
  initService(context: checkbox.Context) {
    return checkbox.machine(context)
  }

  initApi() {
    return checkbox.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))

    const controlEl = rootEl.querySelector<HTMLElement>('.checkbox-control')
    if (controlEl) {
      this.addCleanup(spreadProps(controlEl, this.api.getControlProps()))
      const viewEl = controlEl.querySelector<HTMLElement>('.checkbox-view')
      if (viewEl) {
        viewEl.textContent = this.api.checked ? '✓' : ''
      }
    }

    const labelEl = rootEl.querySelector<HTMLElement>('.checkbox-label')
    if (labelEl) {
      this.addCleanup(spreadProps(labelEl, this.api.getLabelProps()))
      labelEl.textContent = `Input is ${this.api.checked ? 'checked' : 'unchecked'}`
    }
    const inputEl = rootEl.querySelector<HTMLInputElement>('.checkbox-hidden-input')
    if (inputEl)
      this.addCleanup(spreadProps(inputEl, this.api.getHiddenInputProps()))
  }
}

export function createCheckboxElements(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const rootEl = document.createElement('label')
    rootEl.className = 'checkbox-root'
    rootEl.innerHTML = `
      <div class="checkbox-control">
        <div class="checkbox-view" />
      </div>
      <span class="checkbox-label">
      </span>

      <input type="checkbox" class="checkbox-hidden-input" >
    `
    document.body.appendChild(rootEl)
    resolve(rootEl)
  })
}
