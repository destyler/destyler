import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as separator from '../../index'
import styles from '../style.css?inline'
import '@destyler/shared-private/lit'

const navItems = [
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs' },
  { label: 'Source', value: 'source' },
]

@customElement('destyler-separator')
export class SeparatorElement extends LitElement {
  private machine = new MachineController(this, separator.machine({ id: 'separator:lit' }))

  render() {
    const api = separator.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <section class="separator-example">
          <header class="separator-example__header">
            <p class="separator-example__title">Destyler</p>
            <p class="separator-example__subtitle">Unstyled components for Lit.</p>
          </header>

          <div class="separator-line separator-example__divider" ${spread(api.getRootProps())}></div>

          <nav class="separator-example__nav" aria-label="Secondary">
            ${navItems.map((item, index) => html`
              <span class="separator-example__nav-item">${item.label}</span>
              ${index < navItems.length - 1
                ? html`<div
                    class="separator-line separator-example__divider--vertical"
                    ${spread(api.getRootProps('vertical'))}
                  ></div>`
                : null}
            `)}
          </nav>
        </section>

        <destyler-toolbar .viz=${true}>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-separator': SeparatorElement
  }
}
