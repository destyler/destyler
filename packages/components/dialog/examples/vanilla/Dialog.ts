import type { ContextFrom } from '@destyler/vanilla'
import type { State as DialogState, MachineState } from '../../src/types'
import { dialogControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as dialog from '../../index'
import '../style.css'

type DialogMachineContext = ContextFrom<typeof dialog.machine>

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
  private readonly stateListeners = new Set<(state: DialogState) => void>()
  private isMounted = false

  constructor(rootEl: HTMLElement, context: dialog.Context, options?: any) {
    super(rootEl, context, options)
    this.triggerEl = rootEl.querySelector('[data-dialog-trigger]')

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
    this.saveButton.textContent = 'Save'

    this.closeButton.type = 'button'
    this.closeButton.textContent = 'x'

    const actionRow = document.createElement('div')
    actionRow.append(this.formInput, this.saveButton)

    this.contentEl.append(this.titleEl, this.descriptionEl, actionRow, this.closeButton)
    this.positionerEl.appendChild(this.contentEl)
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

export function render(target: HTMLElement) {
  const controls = useControls(dialogControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main data-dialog-example>
      <button type="button" data-testid="dialog:trigger" data-dialog-trigger>Click me</button>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-dialog-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new DialogExample(scope, { id: 'dialog:vanilla' }, {
    context: {
      get: () => controls.context as Partial<DialogMachineContext>,
      subscribe: (fn: (ctx: Partial<DialogMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: DialogState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as DialogState)
  instance.onStateChange(updateVisualizer)
}
