import type { ContextFrom } from '@destyler/vanilla'
import type { State as DialogState, MachineState } from '../../src/types'
import { dialogControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as dialog from '../../index'
import '../style.css'

type DialogMachineContext = ContextFrom<typeof dialog.machine>

export type DialogRenderOptions = Partial<dialog.Context>

class DialogExample extends Component<
  dialog.Context,
  dialog.Api,
  DialogMachineContext,
  MachineState
> {
  private readonly triggerEl: HTMLButtonElement | null
  private readonly backdropEl: HTMLDivElement
  private readonly positionerEl: HTMLDivElement
  private readonly contentEl: HTMLDivElement
  private readonly titleEl: HTMLHeadingElement
  private readonly descriptionEl: HTMLParagraphElement
  private readonly closeButton: HTMLButtonElement
  private readonly formInput: HTMLInputElement
  private readonly saveButton: HTMLButtonElement
  private readonly openStatusEl: HTMLElement | null
  private readonly stateListeners = new Set<(state: DialogState) => void>()
  private isMounted = false
  private controlledOpen = false

  constructor(rootEl: HTMLElement, context: dialog.Context, options?: any) {
    super(rootEl, context, options)
    this.triggerEl = rootEl.querySelector('[data-dialog-trigger]')
    this.openStatusEl = rootEl.ownerDocument.querySelector('[data-open-status]')

    this.backdropEl = document.createElement('div')
    this.positionerEl = document.createElement('div')
    this.contentEl = document.createElement('div')
    this.titleEl = document.createElement('h2')
    this.descriptionEl = document.createElement('p')
    this.closeButton = document.createElement('button')
    this.formInput = document.createElement('input')
    this.saveButton = document.createElement('button')

    this.titleEl.textContent = 'Edit profile'
    this.descriptionEl.textContent = 'Make changes to your profile here. Click save when you are done.'

    this.formInput.placeholder = 'Enter name...'
    this.formInput.setAttribute('data-testid', 'dialog:input')
    this.saveButton.type = 'button'
    this.saveButton.dataset.testid = 'dialog:save'
    this.saveButton.textContent = 'Save'

    this.closeButton.type = 'button'
    this.closeButton.textContent = 'x'

    const actionRow = document.createElement('div')
    actionRow.append(this.formInput, this.saveButton)

    this.contentEl.append(this.titleEl, this.descriptionEl, actionRow, this.closeButton)
    this.positionerEl.appendChild(this.contentEl)

    if (typeof context.open === 'boolean')
      this.controlledOpen = context.open
    else if (context.defaultOpen)
      this.controlledOpen = true
  }

  initService(context: dialog.Context) {
    return dialog.machine(context) as dialog.Service
  }

  initApi() {
    return dialog.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: DialogState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: DialogState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  override destroy(): void {
    this.detachOverlay()
    super.destroy()
  }

  private writeOpenStatus(open: boolean | null) {
    if (!this.openStatusEl)
      return
    this.openStatusEl.dataset.openRequested = open == null ? '' : String(open)
    this.openStatusEl.textContent = `openRequested=${this.openStatusEl.dataset.openRequested}`
  }

  onOpenChange = (details: { open: boolean }) => {
    this.writeOpenStatus(details.open)
  }

  getControlledOpen() {
    return this.controlledOpen
  }

  setControlledOpen(next: boolean) {
    this.controlledOpen = next
  }

  setOpen(nextOpen: boolean) {
    this.api.setOpen(nextOpen)
  }

  syncContext(context: Partial<DialogMachineContext>) {
    this.applyContext(context)
  }

  private attachOverlay() {
    if (this.isMounted)
      return
    document.body.appendChild(this.backdropEl)
    document.body.appendChild(this.positionerEl)
    this.isMounted = true
  }

  private detachOverlay() {
    if (!this.isMounted)
      return
    this.backdropEl.remove()
    this.positionerEl.remove()
    this.isMounted = false
  }

  render = () => {
    const api = this.api

    if (this.triggerEl)
      spreadProps(this.triggerEl, api.getTriggerProps())

    spreadProps(this.backdropEl, api.getBackdropProps())
    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, {
      ...api.getContentProps(),
      'data-testid': 'dialog:content',
    })
    spreadProps(this.titleEl, api.getTitleProps())
    spreadProps(this.descriptionEl, api.getDescriptionProps())
    spreadProps(this.closeButton, {
      ...api.getCloseTriggerProps(),
      'data-testid': 'dialog:clear',
    })

    if (api.open)
      this.attachOverlay()
    else
      this.detachOverlay()
  }
}

export function render(target: HTMLElement, initial?: DialogRenderOptions) {
  const controls = useControls(dialogControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main data-dialog-example>
      <button type="button" data-testid="dialog:trigger" data-dialog-trigger>Click me</button>
      <button type="button" data-testid="outside">outside</button>
      <button type="button" data-testid="dialog:final-focus">final focus</button>
      <button type="button" data-testid="dialog:parent-open" data-dialog-parent-open>Parent Open</button>
      <button type="button" data-testid="dialog:parent-close" data-dialog-parent-close>Parent Close</button>
      <div data-testid="open-status" data-open-status data-open-requested="">openRequested=</div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-dialog-example]')
  if (!scope)
    return () => {}

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  let instance: DialogExample

  const mapControlsContext = (): Partial<DialogMachineContext> => {
    const {
      useInitialFocusEl,
      useFinalFocusEl,
      openControlled = false,
      ...rest
    } = controls.context as Partial<DialogMachineContext> & {
      useInitialFocusEl?: boolean
      useFinalFocusEl?: boolean
      openControlled?: boolean
    }

    const mapped: Partial<DialogMachineContext> = { ...rest }
    if (useInitialFocusEl) {
      mapped.initialFocusEl = () => document.querySelector<HTMLElement>('[data-testid="dialog:save"]')
    }
    if (useFinalFocusEl) {
      mapped.finalFocusEl = () => document.querySelector<HTMLElement>('[data-testid="dialog:final-focus"]')
    }

    mapped['open.controlled'] = Boolean(openControlled)
    if (openControlled)
      mapped.open = instance.getControlledOpen()
    mapped.onOpenChange = details => instance.onOpenChange(details)

    return mapped
  }

  instance = new DialogExample(scope, {
    id: 'dialog:vanilla',
    onOpenChange: () => {},
    ...initial,
  }, {
    context: {
      get: () => mapControlsContext(),
      subscribe: (fn: (ctx: Partial<DialogMachineContext>) => void) =>
        controls.subscribe(() => fn(mapControlsContext())),
    },
  })

  instance.init()
  instance.syncContext(mapControlsContext())

  const openButton = layout.main.querySelector<HTMLButtonElement>('[data-dialog-parent-open]')
  const closeButton = layout.main.querySelector<HTMLButtonElement>('[data-dialog-parent-close]')

  openButton?.addEventListener('click', () => {
    const { openControlled = false } = controls.context as { openControlled?: boolean }
    if (openControlled) {
      instance.setControlledOpen(true)
      instance.syncContext(mapControlsContext())
    }
    else {
      instance.setOpen(true)
    }
  })

  closeButton?.addEventListener('click', () => {
    const { openControlled = false } = controls.context as { openControlled?: boolean }
    if (openControlled) {
      instance.setControlledOpen(false)
      instance.syncContext(mapControlsContext())
    }
    else {
      instance.setOpen(false)
    }
  })

  const updateVisualizer = (state?: DialogState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as DialogState)
  instance.onStateChange(updateVisualizer)

  return () => {
    instance.destroy()
  }
}
