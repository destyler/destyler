import * as image from '@destyler/image'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import '../main'

export class Image extends Component<image.Context, image.Api> {
  initService(context: image.Context) {
    return image.machine(context)
  }

  initApi() {
    return image.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    spreadProps(this.rootEl, this.api.getRootProps())
    const imageEl = rootEl.querySelector<HTMLElement>('.image')
    if (imageEl)
      spreadProps(imageEl, this.api.getImageProps())
    const fallbackEl = rootEl.querySelector<HTMLElement>('.image-fallback')
    if (fallbackEl)
      spreadProps(fallbackEl, this.api.getFallbackProps())
  }
}

document.querySelectorAll<HTMLElement>('.image-root').forEach((rootEl) => {
  const image = new Image(rootEl, { id: nanoid() })
  image.init()
})
