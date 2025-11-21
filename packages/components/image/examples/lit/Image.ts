import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { imagesData } from '@destyler/shared-private'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as avatar from '../../index'

import styles from '../style.css?inline'

const images = imagesData.full
const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

@customElement('destyler-image')
export class ImageElement extends LitElement {
  private machine = new MachineController(this, avatar.machine({ id: 'image:lit' }))

  private src = images[0]
  private show = true

  render() {
    const api = avatar.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="image">
          <div ${spread(api.getRootProps())}>
            <span ${spread(api.getFallbackProps())}>PA</span>
            ${this.show ? html`<img alt="" referrerpolicy="no-referrer" src="${this.src}" ${spread(api.getImageProps())} />` : null}
          </div>

          <div class="controls">
            <button type="button" @click=${() => {
              this.src = getRandomImage()
              this.requestUpdate()
            }}>Change Image</button>
            <button type="button" @click=${() => {
              this.src = imagesData.broken
              this.requestUpdate()
            }}>Broken Image</button>
            <button type="button" @click=${() => {
              this.show = !this.show
              this.requestUpdate()
            }}>Toggle Image</button>
          </div>
        </main>
        <destyler-toolbar>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-image': ImageElement
  }
}
