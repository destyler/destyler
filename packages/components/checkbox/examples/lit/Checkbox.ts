import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { checkboxControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as checkbox from '../../index'
import styles from '../style.css?inline'

type CheckboxMachineContext = ContextFrom<typeof checkbox.machine>

@customElement('destyler-checkbox')
export class CheckboxElement extends LitElement {
  private controls = new ControlsController(checkboxControls)

  private machine = new MachineController(
    this,
    checkbox.machine({
      id: '1',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<CheckboxMachineContext>,
        subscribe: (fn: (ctx: Partial<CheckboxMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = checkbox.connect(this.machine.state, this.machine.send, normalizeProps)
    const rootProps = { ...api.getRootProps() }
    // Remove htmlFor to let the nested input handle activation within the shadow DOM.
    delete (rootProps as any).htmlFor
    const originalClick = rootProps.onClick
    rootProps.onClick = (event: Event) => {
      originalClick?.(event)
      if (event.defaultPrevented)
        return
      const target = event.composedPath()[0]
      if (target instanceof HTMLInputElement)
        return
      api.toggleChecked()
    }

    return html`
    <destyler-layout>
      <label ${spread(rootProps)}>
        <div ${spread(api.getControlProps())}></div>
        <span ${spread(api.getLabelProps())}>
          Input is
          ${api.checked ? html`<span> checked</span>` : html`<span> unchecked</span>`}
        </span>

        <input data-testid="hidden-input" ${spread(api.getHiddenInputProps())}>
      </label>
      <destyler-toolbar .controls=${this.controls} accesskey="0">
        <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
      </destyler-toolbar>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-checkbox': CheckboxElement
  }
}
