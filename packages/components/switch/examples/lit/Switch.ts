import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { switchControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as switchs from '../../index'
import styles from '../style.css?inline'

type SwitchMachineContext = ContextFrom<typeof switchs.machine>

@customElement('destyler-switch')
export class SwitchElement extends LitElement {
  private controls = new ControlsController(switchControls)
  private machine = new MachineController(
    this,
    switchs.machine({
      id: 'switch:lit',
      name: 'switch',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<SwitchMachineContext>,
        subscribe: (fn: (ctx: Partial<SwitchMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = switchs.connect(this.machine.state, this.machine.send, normalizeProps)
    const hiddenInputProps = api.getHiddenInputProps()
    const rootProps = { ...api.getRootProps() }
    delete (rootProps as any).htmlFor
    delete (rootProps as any).for
    const originalClick = rootProps.onClick
    const focusHiddenInput = () => {
      const root = this.renderRoot
      if (!root || !(root as ParentNode).querySelector)
        return
      const input = (root as ParentNode).querySelector<HTMLInputElement>('input[data-switch-hidden]')
      input?.focus()
    }
    rootProps.onClick = (event: Event) => {
      originalClick?.(event)
      if (event.defaultPrevented)
        return
      const target = event.composedPath()[0]
      if (target instanceof HTMLInputElement)
        return
      event.preventDefault()
      focusHiddenInput()
      api.toggleChecked()
    }

    return html`
      <destyler-layout>
        <main>
          <label ${spread(rootProps)}>
            <input data-switch-hidden data-testid="hidden-input" ${spread(hiddenInputProps)} />
            <span ${spread(api.getControlProps())}>
              <span ${spread(api.getThumbProps())}></span>
            </span>
            <span ${spread(api.getLabelProps())}>
              Feature is ${api.checked ? 'enabled' : 'disabled'}
            </span>
          </label>
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
    'destyler-switch': SwitchElement
  }
}
