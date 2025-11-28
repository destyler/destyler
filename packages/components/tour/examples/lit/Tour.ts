import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { tourControls, tourData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as tour from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type TourMachineContext = ContextFrom<typeof tour.machine>

@customElement('destyler-tour')
export class TourElement extends LitElement {
  private controls = new ControlsController(tourControls)

  private machine = new MachineController(
    this,
    tour.machine({
      id: 'tour:lit',
      steps: tourData,
    }),
    {
      context: {
        get: () => this.controls.context as Partial<TourMachineContext>,
        subscribe: (fn: (ctx: Partial<TourMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  private readonly frameSrc = `<div class="tour__frame-inner"><h1 id="step-2a">Iframe Content</h1><p>Tour overlays can highlight DOM that lives inside embedded documents.</p><p>Floating UI keeps all offsets in sync.</p></div>`

  protected createRenderRoot() {
    return this
  }

  render() {
    const api = tour.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <style>${styles}</style>
      <destyler-layout>
        <main class="tour">
          <section>
            <button class="tour__start" @click=${() => api.start()}>
              Start Tour
            </button>

            <div class="steps__container">
              <h3 id="step-1">Step 1 · Welcome</h3>

              <div class="overflow__container">
                <div class="h-200px"></div>
                <h3 id="step-2">Step 2 · Scroll-aware</h3>
                <div class="h-100px"></div>
              </div>

              <iframe class="tour__frame" title="tour-frame" srcdoc=${this.frameSrc}></iframe>

              <h3 id="step-3">Step 3 · Normal flow</h3>
              <h3 id="step-4">Step 4 · Near the bottom</h3>
            </div>
          </section>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state} .omit=${['steps']}>
          </destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>

      ${api.step && api.open
        ? html`
            <div>
              ${api.step?.backdrop ? html`<div ${spread(api.getBackdropProps())}></div>` : null}
              <div ${spread(api.getSpotlightProps())}></div>
              <div ${spread(api.getPositionerProps())}>
                <div ${spread(api.getContentProps())}>
                  ${api.step?.arrow
                    ? html`<div ${spread(api.getArrowProps())}>
                        <div ${spread(api.getArrowTipProps())}></div>
                      </div>`
                    : null}

                  <p ${spread(api.getTitleProps())}>${api.step?.title}</p>
                  <div ${spread(api.getDescriptionProps())}>${api.step?.description}</div>
                  <div ${spread(api.getProgressTextProps())}>${api.getProgressText()}</div>

                  ${api.step?.actions?.length
                    ? html`<div class="tour button__group">
                        ${api.step.actions.map(action => html`<button ${spread(api.getActionTriggerProps({ action }))}>
                          ${action.label}
                        </button>`)}
                      </div>`
                    : null}

                  <button ${spread(api.getCloseTriggerProps())}>
                    ×
                  </button>
                </div>
              </div>
            </div>
          `
        : null}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-tour': TourElement
  }
}
