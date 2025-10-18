import type { ControlsController } from '../controllers/ControlsController'
import { dataAttr } from '@destyler/dom'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import style from '../../bootstrap.css?inline'

@customElement('destyler-toolbar')
export class DestylerToolbar extends LitElement {
  static styles = unsafeCSS(style)

  @property({ type: Boolean }) accessor viz = false
  @property({ attribute: false }) accessor controls: ControlsController<any> | undefined = undefined
  @property({ attribute: false }) accessor activeIndex = 0

  private unsubscribe?: () => void

  connectedCallback(): void {
    super.connectedCallback()
    this.activeIndex = this.viz ? 1 : this.controls ? 0 : 1
    this.setupSubscription()
  }

  disconnectedCallback(): void {
    this.unsubscribe?.()
    this.unsubscribe = undefined
    super.disconnectedCallback()
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('controls')) {
      this.setupSubscription()
      if (!this.controls)
        this.activeIndex = 1
    }
  }

  private setupSubscription() {
    this.unsubscribe?.()
    if (this.controls) {
      this.unsubscribe = this.controls.subscribe(() => this.requestUpdate())
    }
    else {
      this.unsubscribe = undefined
    }
  }

  private setActive(i: number) {
    this.activeIndex = i
  }

  protected render() {
    const hasControls = !!this.controls
    return html`
      <div class="toolbar">
        <nav>
          ${hasControls
            ? html`<button
                data-active=${dataAttr(this.activeIndex === 0)}
                @click=${() => this.setActive(0)}
              >Controls</button>`
            : null}
          <button
            data-active=${dataAttr(this.activeIndex === 1)}
            @click=${() => this.setActive(1)}
          >Visualizer</button>
        </nav>
        <div>
          ${hasControls
            ? html`<div data-content data-active=${dataAttr(this.activeIndex === 0)}>
                ${this.controls!.render()}
              </div>`
            : null}
          <div data-content data-active=${dataAttr(this.activeIndex === 1)}>
            <slot></slot>
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-toolbar': DestylerToolbar
  }
}
