import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as image from '../../index'

export class Image extends Component<image.Context, image.Api> {
  initService(context: image.Context) {
    return image.machine(context)
  }

  initApi() {
    return image.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createImage(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'image'
    root.textContent = 'Image Component'
    resolve(root)
  })
}
