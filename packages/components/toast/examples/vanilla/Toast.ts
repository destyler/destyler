import { toastControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as toast from '../../index'
import '../style.css'

type GroupUserContext = toast.GroupMachineContext

type GroupState = toast.GroupState

type ToastActor = toast.Service

class ToastItemView {
  public readonly el: HTMLElement
  private ghostBefore: HTMLElement
  private titleEl: HTMLParagraphElement
  private descriptionEl: HTMLParagraphElement
  private closeButton: HTMLButtonElement
  private closeIcon: HTMLDivElement
  private ghostAfter: HTMLElement
  private unsubscribe?: () => void

  constructor(private actor: ToastActor) {
    this.el = document.createElement('div')
    this.ghostBefore = document.createElement('div')
    this.titleEl = document.createElement('p')
    this.descriptionEl = document.createElement('p')
    this.closeButton = document.createElement('button')
    this.closeIcon = document.createElement('div')
    this.ghostAfter = document.createElement('div')

    this.closeIcon.classList.add('i-ph-x-bold')
    this.closeButton.appendChild(this.closeIcon)

    this.el.append(this.ghostBefore, this.titleEl, this.descriptionEl, this.closeButton, this.ghostAfter)

    this.render()
    this.unsubscribe = this.actor.subscribe(() => this.render())
  }

  private get api() {
    return toast.connect(this.actor.getState(), this.actor.send, normalizeProps)
  }

  public render() {
    const api = this.api
    spreadProps(this.el, api.getRootProps())
    spreadProps(this.ghostBefore, api.getGhostBeforeProps())
    spreadProps(this.titleEl, api.getTitleProps())
    this.titleEl.textContent = api.title ?? ''
    spreadProps(this.descriptionEl, api.getDescriptionProps())
    this.descriptionEl.textContent = api.description ?? ''
    spreadProps(this.closeButton, api.getCloseTriggerProps())
    spreadProps(this.ghostAfter, api.getGhostAfterProps())
  }

  public destroy() {
    this.unsubscribe?.()
    this.unsubscribe = undefined
  }
}

class ToastExample extends Component<any, toast.GroupApi> {
  private infoButton = this.rootEl.querySelector<HTMLButtonElement>('[data-toast-action="info"]')
  private successButton = this.rootEl.querySelector<HTMLButtonElement>('[data-toast-action="success"]')
  private errorButton = this.rootEl.querySelector<HTMLButtonElement>('[data-toast-action="error"]')
  private promiseButton = this.rootEl.querySelector<HTMLButtonElement>('[data-toast-action="promise"]')
  private longButton = this.rootEl.querySelector<HTMLButtonElement>('[data-toast-action="long"]')
  private dismissButton = this.rootEl.querySelector<HTMLButtonElement>('[data-toast-action="dismiss"]')
  private regionEl = this.rootEl.querySelector<HTMLElement>('[data-toast-region]')

  private toastViews = new Map<string, ToastItemView>()
  private readonly stateListeners = new Set<(state: GroupState) => void>()

  constructor(rootEl: HTMLElement, context: GroupUserContext, options?: any) {
    super(rootEl, context as any, options)
    this.attachHandlers()
  }

  private attachHandlers() {
    this.infoButton?.addEventListener('click', () =>
      this.pushBasic('info', 'Your workspace was moved to the new region.'))
    this.successButton?.addEventListener('click', () => this.pushBasic('success'))
    this.errorButton?.addEventListener('click', () =>
      this.pushBasic('error', 'We could not process the request. Please retry.'))
    this.promiseButton?.addEventListener('click', () => this.pushPromise())
    this.longButton?.addEventListener('click', () =>
      this.api?.create({
        title: 'Queued upload',
        description: 'We will notify you once it finishes.',
        type: 'info',
        duration: 8000,
      }))
    this.dismissButton?.addEventListener('click', () => this.api?.dismiss())
  }

  initService(context: any) {
    return toast.group.machine(context as GroupUserContext) as toast.GroupService
  }

  initApi() {
    return toast.group.connect(this.service.state as any, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: GroupState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: any) {
    this.stateListeners.forEach(listener => listener(state as GroupState))
  }

  private pushBasic(type: toast.Type, description?: string) {
    this.api?.create({
      title: type === 'success' ? 'Payment complete' : 'Heads up',
      description: description ?? 'A new notification just arrived.',
      type,
    })
  }

  private pushPromise() {
    const task = new Promise<string>((resolve, reject) => {
      const shouldFail = Math.random() < 0.35
      setTimeout(() => {
        if (shouldFail)
          reject(new Error('Server rejected the update.'))
        else resolve('Customer profile is now synced.')
      }, 1600)
    })

    this.api?.promise(task, {
      loading: {
        title: 'Syncing customer...',
        type: 'loading',
      },
      success: value => ({
        title: 'All caught up',
        description: value,
        type: 'success',
      }),
      error: error => ({
        title: 'Sync failed',
        description: error.message,
        type: 'error',
      }),
    })
  }

  private renderPlacements() {
    if (!this.regionEl)
      return

    if (!this.api)
      return

    const placements = this.api.getPlacements()
    const activeToastIds = new Set<string>()

    this.regionEl.innerHTML = ''

    placements.forEach((placement) => {
      const groupEl = document.createElement('div')
      groupEl.dataset.layout = 'toast-examples'
      groupEl.classList.add('toast-demo__region')
      spreadProps(groupEl, this.api!.getGroupProps({ placement }))

      const toasts = this.api!.getToastsByPlacement(placement)
      toasts.forEach((actor) => {
        activeToastIds.add(actor.id)
        let view = this.toastViews.get(actor.id)
        if (!view) {
          view = new ToastItemView(actor)
          this.toastViews.set(actor.id, view)
        }
        groupEl.appendChild(view.el)
      })

      this.regionEl!.appendChild(groupEl)
    })

    Array.from(this.toastViews.entries()).forEach(([id, view]) => {
      if (!activeToastIds.has(id)) {
        view.destroy()
        this.toastViews.delete(id)
      }
    })
  }

  render = () => {
    this.renderPlacements()
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(toastControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="toast-demo" data-toast-example>
      <section class="toast-demo__actions">
        <button type="button" data-toast-action="info">Info toast</button>
        <button type="button" class="secondary" data-toast-action="success">Success toast</button>
        <button type="button" class="secondary" data-toast-action="error">Error toast</button>
        <button type="button" class="ghost" data-toast-action="dismiss">Dismiss all</button>
      </section>

      <section class="toast-demo__actions">
        <button type="button" data-toast-action="promise">Promise toast</button>
        <button type="button" class="ghost" data-toast-action="long">Long toast</button>
      </section>

      <div data-toast-region></div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-toast-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const withId = (ctx: Partial<GroupUserContext>): GroupUserContext => ({ id: 'toast:vanilla', ...ctx }) as GroupUserContext

  const contextSource = {
    get: () => withId(controls.context as Partial<GroupUserContext>),
    subscribe: (fn: (ctx: GroupUserContext) => void) =>
      controls.subscribe((ctx: Partial<GroupUserContext>) => fn(withId(ctx))),
  }

  const instance = new ToastExample(scope, contextSource.get(), {
    context: contextSource,
  })
  instance.init()

  const updateVisualizer = (state?: GroupState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as unknown as GroupState | undefined)
  instance.onStateChange(updateVisualizer)
}
