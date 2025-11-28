import type { ContextFrom } from '@destyler/vanilla'
import type { State as EditState, MachineState } from '../../src/types'
import { editControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as edit from '../../index'
import '../style.css'

type EditMachineContext = ContextFrom<typeof edit.machine>

class EditExample extends Component<
  edit.Context,
  edit.Api,
  EditMachineContext,
  MachineState
> {
  private readonly rootNode: HTMLElement
  private readonly areaEl: HTMLElement | null
  private readonly inputEl: HTMLInputElement | null
  private readonly previewEl: HTMLElement | null
  private readonly controlEl: HTMLElement | null
  private readonly submitTriggerEl: HTMLButtonElement | null
  private readonly cancelTriggerEl: HTMLButtonElement | null
  private readonly editTriggerEl: HTMLButtonElement | null

  private readonly stateListeners = new Set<(state: EditState) => void>()

  constructor(rootEl: HTMLElement, context: edit.Context, options?: any) {
    super(rootEl, context, options)
    this.rootNode = rootEl
    this.areaEl = rootEl.querySelector('[data-edit-area]')
    this.inputEl = rootEl.querySelector('[data-edit-input]')
    this.previewEl = rootEl.querySelector('[data-edit-preview]')
    this.controlEl = rootEl.querySelector('[data-edit-control]')
    this.submitTriggerEl = rootEl.querySelector('[data-edit-submit]')
    this.cancelTriggerEl = rootEl.querySelector('[data-edit-cancel]')
    this.editTriggerEl = rootEl.querySelector('[data-edit-trigger]')
  }

  initService(context: edit.Context) {
    return edit.machine(context) as edit.Service
  }

  initApi() {
    return edit.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: EditState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: EditState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    spreadProps(this.rootNode, api.getRootProps())

    if (this.areaEl)
      spreadProps(this.areaEl, api.getAreaProps())

    if (this.inputEl) {
      spreadProps(this.inputEl, {
        ...api.getInputProps(),
        'data-testid': 'edit:input',
      })
    }

    if (this.previewEl) {
      spreadProps(this.previewEl, {
        ...api.getPreviewProps(),
        'data-testid': 'edit:preview',
      })
      this.previewEl.textContent = api.valueText
    }

    if (this.controlEl)
      spreadProps(this.controlEl, api.getControlProps())

    if (this.submitTriggerEl) {
      spreadProps(this.submitTriggerEl, {
        ...api.getSubmitTriggerProps(),
        'data-testid': 'edit:save:trigger',
      })
      this.submitTriggerEl.textContent = 'Save'
    }

    if (this.cancelTriggerEl) {
      spreadProps(this.cancelTriggerEl, {
        ...api.getCancelTriggerProps(),
        'data-testid': 'edit:cancel:trigger',
      })
      this.cancelTriggerEl.textContent = 'Cancel'
    }

    if (this.editTriggerEl) {
      spreadProps(this.editTriggerEl, {
        ...api.getEditTriggerProps(),
        'data-testid': 'edit:trigger',
      })
      this.editTriggerEl.textContent = 'Edit'
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(editControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-testid="outside">out side</div>
    <div data-edit-root>
      <div data-edit-area>
        <input data-edit-input />
        <span data-edit-preview></span>
      </div>
      <div data-edit-control>
        <button type="button" data-edit-submit>Save</button>
        <button type="button" data-edit-cancel>Cancel</button>
        <button type="button" data-edit-trigger>Edit</button>
      </div>
    </div>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-edit-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new EditExample(rootEl, {
    id: 'edit:vanilla',
    value: 'Hello World',
  }, {
    context: {
      get: () => controls.context as Partial<EditMachineContext>,
      subscribe: (fn: (ctx: Partial<EditMachineContext>) => void) => controls.subscribe(fn),
    },
  })

  instance.init()

  const updateVisualizer = (state?: EditState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as EditState)
  instance.onStateChange(updateVisualizer)
}
