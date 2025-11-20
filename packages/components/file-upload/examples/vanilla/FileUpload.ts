import type { PropTypes } from '@destyler/types'
import type { ContextFrom } from '@destyler/vanilla'
import type { State as FileUploadState, MachineState } from '../../src/types'
import { fileUploadControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as fileUpload from '../../index'
import '../style.css'

type FileUploadMachineContext = ContextFrom<typeof fileUpload.machine>

class FileUploadExample extends Component<
  fileUpload.Context,
  fileUpload.Api<PropTypes>,
  FileUploadMachineContext,
  MachineState
> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-file-upload-root]')
  private readonly dropzoneEl = this.rootEl.querySelector<HTMLElement>('[data-file-upload-dropzone]')
  private readonly hiddenInputEl = this.rootEl.querySelector<HTMLInputElement>('[data-file-upload-hidden-input]')
  private readonly triggerEl = this.rootEl.querySelector<HTMLButtonElement>('[data-file-upload-trigger]')
  private readonly itemGroupEl = this.rootEl.querySelector<HTMLUListElement>('[data-file-upload-item-group]')

  private readonly stateListeners = new Set<(state: FileUploadState) => void>()

  initService(context: fileUpload.Context) {
    return fileUpload.machine(context) as fileUpload.Service
  }

  initApi() {
    return fileUpload.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: FileUploadState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: FileUploadState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private renderItems(api: fileUpload.Api<PropTypes>) {
    if (!this.itemGroupEl)
      return

    this.itemGroupEl.innerHTML = ''
    api.acceptedFiles.forEach((file) => {
      const li = document.createElement('li')
      spreadProps(li, api.getItemProps({ file }))

      const name = document.createElement('div')
      name.textContent = file.name
      spreadProps(name, api.getItemNameProps({ file }))

      const deleteButton = document.createElement('button')
      deleteButton.textContent = 'Delete'
      deleteButton.type = 'button'
      spreadProps(deleteButton, api.getItemDeleteTriggerProps({ file }))

      li.append(name, deleteButton)
      this.itemGroupEl!.appendChild(li)
    })
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())
    if (this.dropzoneEl)
      spreadProps(this.dropzoneEl, api.getDropzoneProps())
    if (this.hiddenInputEl)
      spreadProps(this.hiddenInputEl, api.getHiddenInputProps())
    if (this.triggerEl) {
      this.triggerEl.type = 'button'
      spreadProps(this.triggerEl, api.getTriggerProps())
    }
    if (this.itemGroupEl) {
      spreadProps(this.itemGroupEl, api.getItemGroupProps())
      this.renderItems(api)
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(fileUploadControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="file-upload">
      <div data-file-upload-example>
        <div data-file-upload-root>
          <div data-file-upload-dropzone>
            <input data-file-upload-hidden-input />
            <p>Drag and drop your files here</p>
            <p>or</p>
            <button type="button" data-file-upload-trigger>
              Choose Files...
            </button>
          </div>
          <ul data-file-upload-item-group></ul>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-file-upload-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new FileUploadExample(scope, { id: 'file-upload:vanilla' }, {
    context: {
      get: () => controls.context as Partial<FileUploadMachineContext>,
      subscribe: (fn: (ctx: Partial<FileUploadMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: FileUploadState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as FileUploadState)
  instance.onStateChange(updateVisualizer)
}
