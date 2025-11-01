import { highlightState } from '@destyler/stringify'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import style from '../../bootstrap.css?inline'

@customElement('destyler-state-visualizer')
export class DestylerStateVisualizer extends LitElement {
  static styles = unsafeCSS(style)

  @property({ attribute: false }) accessor state: any = undefined as any
  @property({ type: String }) accessor label: string | undefined = undefined
  @property({ attribute: false }) accessor omit: string[] | undefined = undefined

  protected render() {
    const htmlStr = highlightState(this.state as any, this.omit)
    return html`
      <div class="viz">
        <pre>
          <details open>
            <summary>${this.label ?? 'Visualizer'}</summary>
            <div class="state">${unsafeHTML(htmlStr)}</div>
          </details>
        </pre>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-state-visualizer': DestylerStateVisualizer
  }
}
