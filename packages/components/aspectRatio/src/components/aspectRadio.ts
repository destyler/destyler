import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@destyler/primitive'

@customElement('destyler-aspect-ratio')
export class AspectRatio extends LitElement {
  @property({ type: Number })
  ratio = 1

  override render() {
    const aspect = `${(1 / this.ratio) * 100}%`
    const props = {
      'data-aspect': aspect,
    }
    return html`
      <div
        style="position: relative;width: 100%;padding-bottom: ${aspect};"
        data-destyler-aspect-ratio-wrapper=""
      >
        <div style="position: absolute; inset: 0px;">
          <destyler-slot .props="${props}">
            <slot></slot>
          </destyler-slot>
        </div>
      </div>
    `
  }
}
