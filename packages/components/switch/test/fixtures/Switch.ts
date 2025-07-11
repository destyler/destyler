import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as switchComponent from '../../index'

export class Switch extends Component<switchComponent.Context, switchComponent.Api> {
  initService(context: switchComponent.Context) {
    return switchComponent.machine(context)
  }

  initApi() {
    return switchComponent.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))

    const controlEl = rootEl.querySelector<HTMLElement>('.switch-control')
    if (controlEl) {
      this.addCleanup(spreadProps(controlEl, this.api.getControlProps()))
    }

    const thumbEl = rootEl.querySelector<HTMLElement>('.switch-thumb')
    if (thumbEl) {
      this.addCleanup(spreadProps(thumbEl, this.api.getThumbProps()))
    }

    const labelEl = rootEl.querySelector<HTMLElement>('.switch-label')
    if (labelEl) {
      this.addCleanup(spreadProps(labelEl, this.api.getLabelProps()))
    }

    const hiddenInputEl = rootEl.querySelector<HTMLInputElement>('.switch-input')
    if (hiddenInputEl) {
      this.addCleanup(spreadProps(hiddenInputEl, this.api.getHiddenInputProps()))
    }

    const disabledSwitchEl = rootEl.querySelector<HTMLElement>('.disabled-switch')
    if (disabledSwitchEl) {
      const disabledSwitch = new Switch(disabledSwitchEl, {
        id: crypto.randomUUID(),
        checked: false,
        disabled: true,
      })
      disabledSwitch.init()
    }
  }
}

export function createSwitch(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.gap = '20px'

    // Regular switch
    const switchEl = document.createElement('div')
    switchEl.className = 'switch'

    const controlEl = document.createElement('div')
    controlEl.className = 'switch-control'
    controlEl.style.width = '44px'
    controlEl.style.height = '24px'
    controlEl.style.borderRadius = '12px'
    controlEl.style.background = '#ccc'
    controlEl.style.position = 'relative'
    controlEl.style.cursor = 'pointer'
    controlEl.style.transition = 'all 0.2s'

    const thumbEl = document.createElement('div')
    thumbEl.className = 'switch-thumb'
    thumbEl.style.width = '20px'
    thumbEl.style.height = '20px'
    thumbEl.style.borderRadius = '10px'
    thumbEl.style.background = 'white'
    thumbEl.style.position = 'absolute'
    thumbEl.style.top = '2px'
    thumbEl.style.left = '2px'
    thumbEl.style.transition = 'all 0.2s'

    const hiddenInput = document.createElement('input')
    hiddenInput.className = 'switch-input'
    hiddenInput.setAttribute('data-testid', 'hidden-input')

    const labelEl = document.createElement('div')
    labelEl.className = 'switch-label'
    labelEl.textContent = 'Switch Label'

    controlEl.appendChild(thumbEl)
    controlEl.appendChild(hiddenInput)
    switchEl.appendChild(controlEl)
    switchEl.appendChild(labelEl)

    // Disabled switch
    const disabledSwitchEl = document.createElement('div')
    disabledSwitchEl.className = 'disabled-switch'
    disabledSwitchEl.setAttribute('data-testid', 'disabled-switch')

    const disabledControlEl = document.createElement('div')
    disabledControlEl.className = 'switch-control'
    disabledControlEl.style.width = '44px'
    disabledControlEl.style.height = '24px'
    disabledControlEl.style.borderRadius = '12px'
    disabledControlEl.style.background = '#e0e0e0'
    disabledControlEl.style.position = 'relative'
    disabledControlEl.style.cursor = 'not-allowed'
    disabledControlEl.style.opacity = '0.6'

    const disabledThumbEl = document.createElement('div')
    disabledThumbEl.className = 'switch-thumb'
    disabledThumbEl.style.width = '20px'
    disabledThumbEl.style.height = '20px'
    disabledThumbEl.style.borderRadius = '10px'
    disabledThumbEl.style.background = 'white'
    disabledThumbEl.style.position = 'absolute'
    disabledThumbEl.style.top = '2px'
    disabledThumbEl.style.left = '2px'

    const disabledHiddenInput = document.createElement('input')
    disabledHiddenInput.className = 'switch-input'
    disabledHiddenInput.setAttribute('data-testid', 'disabled-input')

    const disabledLabelEl = document.createElement('div')
    disabledLabelEl.className = 'switch-label'
    disabledLabelEl.textContent = 'Disabled Switch'

    disabledControlEl.appendChild(disabledThumbEl)
    disabledControlEl.appendChild(disabledHiddenInput)
    disabledSwitchEl.appendChild(disabledControlEl)
    disabledSwitchEl.appendChild(disabledLabelEl)

    container.appendChild(switchEl)
    container.appendChild(disabledSwitchEl)

    resolve(container)
  })
}
