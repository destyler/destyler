import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { aspectRatioControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as aspectRatio from '../../index'
import styles from '../style.css?inline'

@customElement('aspect-ratio')
export class AspectRatioElement extends LitElement {
  private controls = new ControlsController(aspectRatioControls)

  private machine = new MachineController(
    this,
    aspectRatio.machine({
      id: '1',
    }),
    {
      context: {
        get: () => this.controls.context,
        subscribe: (fn: (ctx: Partial<aspectRatio.Context>) => void) => this.controls.subscribe(fn),
      },
    },
  )

  render() {
    const api = aspectRatio.connect(this.machine.state, this.machine.send, normalizeProps)
    return html`
    <destyler-layout>
      <div class="aspect-ratio-root">
        <div ${spread(api.getRootProps())}>
          <div ${spread(api.getContentProps())}>
            <img
              class="aspect-ratio-img"
              src="https://elonehoo.me/gallery/20_sun.jpg"
            >
          </div>
        </div>
      </div>
      <destyler-toolbar .controls=${this.controls} accesskey="0">
        <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
      </destyler-toolbar>
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
