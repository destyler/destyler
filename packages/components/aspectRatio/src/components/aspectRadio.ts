import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('destyler-aspect-ratio')
export class AspectRatio extends LitElement {
  @property({ type: Number })
  ratio = 1

  override render() {
    const paddingBottom = `${(1 / this.ratio) * 100}%`

    return html`
      <div
        style="position: relative;width: 100%;padding-bottom: ${paddingBottom};"
        data-destyler-aspect-ratio-wrapper=""
      >
        <div style="position: absolute; inset: 0px;">
          <slot></slot>
        </div>
      </div>
    `
  }
}
