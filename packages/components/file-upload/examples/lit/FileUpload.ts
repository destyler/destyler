import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { fileUploadControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as fileUpload from '../../index'
import styles from '../style.css?inline'

type FileUploadMachineContext = ContextFrom<typeof fileUpload.machine>

@customElement('destyler-file-upload')
export class FileUploadElement extends LitElement {
  private controls = new ControlsController(fileUploadControls)

  private machine = new MachineController(
    this,
    fileUpload.machine({
      id: 'file-upload:lit',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<FileUploadMachineContext>,
        subscribe: (fn: (ctx: Partial<FileUploadMachineContext>) => void) =>
          this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = fileUpload.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="file-upload">
          <div ${spread(api.getRootProps())}>
            <div ${spread(api.getDropzoneProps())}>
              <input ${spread(api.getHiddenInputProps())} />
              <p>Drag and drop your files here</p>
              <p>or</p>
              <button type="button" ${spread(api.getTriggerProps())}>
                Choose Files...
              </button>
            </div>

            <ul ${spread(api.getItemGroupProps())}>
              ${api.acceptedFiles.map(file => html`
                <li ${spread(api.getItemProps({ file }))}>
                  <div ${spread(api.getItemNameProps({ file }))}>${file.name}</div>
                  <button type="button" ${spread(api.getItemDeleteTriggerProps({ file }))}>
                    Delete
                  </button>
                </li>
              `)}
            </ul>
          </div>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-file-upload': FileUploadElement
  }
}
