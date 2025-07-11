import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as slider from '../../index'

export class Slider extends Component<slider.Context, slider.Api> {
  initService(context: slider.Context) {
    return slider.machine(context)
  }

  initApi() {
    return slider.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createSlider(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'slider'
    root.textContent = 'Slider Component'
    resolve(root)
  })
}
