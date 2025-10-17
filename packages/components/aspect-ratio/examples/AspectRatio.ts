import type { PropTypes } from '@destyler/types'
import { Component, normalizeProps, spread } from '@destyler/lit'
import { html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as aspectRatio from '../index'
import styles from './style.css?inline'
import '@destyler/shared-private/lit'

@customElement('aspect-ratio')
export class AspectRatioElement extends Component<aspectRatio.Context, aspectRatio.Api, aspectRatio.Service> {
  initService(_context: aspectRatio.Context): aspectRatio.Service {
    return aspectRatio.machine({
      id: '1',
      ratio: 16 / 9,
    })
  }

  initApi(): aspectRatio.Api<PropTypes> {
    return aspectRatio.connect(this.state, this.service.send, normalizeProps)
  }

  render() {
    return html`
    <destyler-layout>
      <div class="aspect-ratio-root">
        <div ${spread(this.api.getRootProps())}>
          <div ${spread(this.api.getContentProps())}>
            <img
              class="aspect-ratio-img"
              src="https://elonehoo.me/gallery/20_sun.jpg"
            >
          </div>
        </div>
      </div>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'aspect-ratio': AspectRatioElement
  }
}
