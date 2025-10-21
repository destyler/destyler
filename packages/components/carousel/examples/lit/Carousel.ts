import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { carouselControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as carousel from '../../index'
import styles from '../style.css?inline'

@customElement('destyler-carousel')
export class CarouselElement extends LitElement {
  items = [
    'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ]

  private controls = new ControlsController(carouselControls)

  private machine = new MachineController(
    this,
    carousel.machine({
      id: '1',
      slideCount: this.items.length,
      spacing: '20px',
      slidesPerPage: 1,
      autoplay: false,
    }),
  )

  render() {
    const api = carousel.connect(this.machine.state, this.machine.send, normalizeProps)
    return html`
    <destyler-layout>
      <div ${spread(api.getRootProps())}>
        <div ${spread(api.getItemGroupProps())}>
          ${this.items.map((image, index) => html`
            <div ${spread(api.getItemProps({ index }))}>
              <img src=${image} alt="" />
            </div>
          `)}
        </div>
        <div ${spread(api.getControlProps())}>
          <button ${spread(api.getPrevTriggerProps())}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
          </button>
          <div ${spread(api.getIndicatorGroupProps())}>
            ${Array.from({ length: api.pageSnapPoints.length }).map((_, index) => (
              html`<button ${spread(api.getIndicatorProps({ index }))} />`
            ))}
          </div>
          <button ${spread(api.getNextTriggerProps())}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
          </button>
        </div>
      </div>
      <div class="carousel-spacer">
        <button class="button" @click=${() => api.scrollToIndex(1)}>
          Scroll to 1
        </button>
        <button ${spread(api.getAutoplayTriggerProps())} class="button">
          ${api.isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-carousel': CarouselElement
  }
}
