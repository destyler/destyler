import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as separator from '../../index'

export class Separator extends Component<separator.Context, separator.Api> {
  initService(context: separator.Context) {
    return separator.machine(context)
  }

  initApi() {
    return separator.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))

    const verticalEl = rootEl.querySelector<HTMLElement>('.vertical-separator')
    if (verticalEl) {
      this.addCleanup(spreadProps(verticalEl, this.api.getRootProps('vertical')))
    }
  }
}

export function createSeparator(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const container = document.createElement('div')

    const horizontal = document.createElement('div')
    horizontal.className = 'separator'
    horizontal.style.height = '1px'
    horizontal.style.background = '#e1e5e9'
    horizontal.style.margin = '15px 0'

    const vertical = document.createElement('div')
    vertical.className = 'vertical-separator'
    vertical.setAttribute('data-testid', 'vertical-separator')
    vertical.style.width = '1px'
    vertical.style.height = '100px'
    vertical.style.background = '#e1e5e9'
    vertical.style.margin = '15px'

    container.appendChild(horizontal)
    container.appendChild(vertical)
    resolve(container)
  })
}
