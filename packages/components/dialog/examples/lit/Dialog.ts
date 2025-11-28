import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, portal, spread } from '@destyler/lit'
import { dialogControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as dialog from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type DialogMachineContext = ContextFrom<typeof dialog.machine>

@customElement('destyler-dialog')
export class DialogElement extends LitElement {
  private controls = new ControlsController(dialogControls)

  private machine = new MachineController(
    this,
    dialog.machine({
      id: 'dialog:lit',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<DialogMachineContext>,
        subscribe: (fn: (ctx: Partial<DialogMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = dialog.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <button ${spread(api.getTriggerProps())}>Click me</button>
          ${api.open
            ? portal(
                html`
                  <div>
                    <div ${spread(api.getBackdropProps())}></div>
                    <div ${spread(api.getPositionerProps())}>
                      <div ${spread(api.getContentProps())}>
                        <h2 ${spread(api.getTitleProps())}>Edit profile</h2>
                        <p ${spread(api.getDescriptionProps())}>
                          Make changes to your profile here. Click save when you are done.
                        </p>
                        <div>
                          <input placeholder="Enter name..." />
                          <button type="button">Save</button>
                        </div>
                        <button ${spread(api.getCloseTriggerProps())}>x</button>
                      </div>
                    </div>
                  </div>
                `,
                document.body,
              )
            : null}
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
    'destyler-dialog': DialogElement
  }
}
