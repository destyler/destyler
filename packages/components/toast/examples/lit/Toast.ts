import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { toastControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as toast from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type ToastGroupContext = ContextFrom<typeof toast.group.machine>

@customElement('destyler-toast')
export class ToastElement extends LitElement {
  private controls = new ControlsController(toastControls)

  private machine = new MachineController(
    this,
    toast.group.machine({
      id: 'toast:lit',
      placement: 'bottom-end',
      overlap: true,
      removeDelay: 200,
    }),
    {
      context: {
        get: () => ({ id: 'toast:lit', ...this.controls.context }) as Partial<ToastGroupContext>,
        subscribe: (fn: (ctx: Partial<ToastGroupContext>) => void) =>
          this.controls.subscribe(ctx => fn({ id: 'toast:lit', ...(ctx as Partial<ToastGroupContext>) })),
      },
    },
  )

  private actorUnsubs = new Map<string, () => void>()
  private api: toast.GroupApi | null = null

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.actorUnsubs.forEach(unsub => unsub())
    this.actorUnsubs.clear()
  }

  private ensureActorSubscription(actor: toast.Service) {
    if (this.actorUnsubs.has(actor.id))
      return
    const unsub = actor.subscribe(() => this.requestUpdate())
    this.actorUnsubs.set(actor.id, unsub)
  }

  private cleanupActorSubscriptions(active: Set<string>) {
    for (const [id, dispose] of this.actorUnsubs) {
      if (!active.has(id)) {
        dispose()
        this.actorUnsubs.delete(id)
      }
    }
  }

  private pushBasic(type: toast.Type, description?: string) {
    this.api?.create({
      title: type === 'success' ? 'Deployment shipped' : 'Heads up',
      description: description ?? 'A teammate mentioned you in a comment.',
      type,
    })
  }

  private pushPromise() {
    const task = new Promise<string>((resolve, reject) => {
      const shouldFail = Math.random() < 0.35
      setTimeout(() => {
        if (shouldFail)
          reject(new Error('Report generation failed.'))
        else resolve('Report generated and emailed to you.')
      }, 1700)
    })

    this.api?.promise(task, {
      loading: { title: 'Generating report...', type: 'loading' },
      success: value => ({ title: 'Report ready', description: value, type: 'success' }),
      error: error => ({ title: 'Report failed', description: error.message, type: 'error' }),
    })
  }

  private pushLongToast() {
    this.api?.create({
      title: 'Nightly backup',
      description: 'Running in the background.',
      type: 'info',
      duration: 9000,
    })
  }

  private renderToast(actor: toast.Service) {
    const api = toast.connect(actor.getState(), actor.send, normalizeProps)
    return html`
      <div ${spread(api.getRootProps())}>
        <div ${spread(api.getGhostBeforeProps())}></div>
        <p ${spread(api.getTitleProps())}>${api.title ?? ''}</p>
        <p ${spread(api.getDescriptionProps())}>${api.description ?? ''}</p>
        <button ${spread(api.getCloseTriggerProps())}>
          <div class="i-ph-x-bold"></div>
        </button>
        <div ${spread(api.getGhostAfterProps())}></div>
      </div>
    `
  }

  render() {
    const api = toast.group.connect(this.machine.state as any, this.machine.send, normalizeProps)
    this.api = api

    const placements = api.getPlacements()
    const activeIds = new Set<string>()
    placements.forEach((placement) => {
      api.getToastsByPlacement(placement).forEach((actor) => {
        activeIds.add(actor.id)
        this.ensureActorSubscription(actor)
      })
    })
    this.cleanupActorSubscriptions(activeIds)

    return html`
      <destyler-layout>
        <main class="toast-demo">
          <section class="toast-demo__actions">
            <button type="button" @click=${() => this.pushBasic('info', 'Production deploy has started.')}>
              Info toast
            </button>
            <button type="button" class="secondary" @click=${() => this.pushBasic('success')}>
              Success toast
            </button>
            <button type="button" class="secondary" @click=${() => this.pushBasic('error')}>
              Error toast
            </button>
            <button type="button" class="ghost" @click=${() => this.api?.dismiss()}>
              Dismiss all
            </button>
          </section>

          <section class="toast-demo__actions">
            <button type="button" @click=${() => this.pushPromise()}>
              Promise toast
            </button>
            <button type="button" class="ghost" @click=${() => this.pushLongToast()}>
              Long toast
            </button>
          </section>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>

        <div>
          ${placements.map(placement => html`
            <div
              data-layout="toast-examples"
              class="toast-demo__region"
              ${spread(api.getGroupProps({ placement }))}
            >
              ${api.getToastsByPlacement(placement).map(actor => this.renderToast(actor))}
            </div>
          `)}
        </div>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-toast': ToastElement
  }
}
