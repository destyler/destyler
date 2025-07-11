import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as colorPicker from '../../index'

export class ColorPicker extends Component<colorPicker.Context, colorPicker.Api> {
  initService(context: colorPicker.Context) {
    return colorPicker.machine(context)
  }

  initApi() {
    return colorPicker.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createColorPicker(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'colorPicker'
    root.textContent = 'ColorPicker Component'
    resolve(root)
  })
}
