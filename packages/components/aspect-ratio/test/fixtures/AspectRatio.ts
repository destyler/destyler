import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as aspectRatio from '../../index'

export class AspectRatio extends Component<aspectRatio.Context, aspectRatio.Api> {
  initService(context: aspectRatio.Context) {
    return aspectRatio.machine(context)
  }

  initApi() {
    return aspectRatio.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))

    const contentEl = rootEl.querySelector<HTMLElement>('.aspect-ratio-content')
    if (contentEl)
      this.addCleanup(spreadProps(contentEl, this.api.getContentProps()))
  }
}

export function createAspectRatio(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'aspect-ratio'
    const content = document.createElement('div')
    content.className = 'aspect-ratio-content'
    const img = document.createElement('img')
    img.src = 'https://elonehoo.me/gallery/20_sun.jpg'
    content.appendChild(img)
    root.appendChild(content)
    resolve(root)
  })
}
