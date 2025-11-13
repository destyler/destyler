import type { ContextFrom } from '@destyler/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as collapsible from '../../index'
import '../style.css'

const sampleText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat.
`

type CollapsibleMachineContext = ContextFrom<typeof collapsible.machine>

class CollapsibleExample extends Component<
  collapsible.Context,
  collapsible.Api,
  CollapsibleMachineContext,
  collapsible.MachineState
> {
  initService(context: collapsible.Context) {
    return collapsible.machine(context) as collapsible.Service
  }

  initApi() {
    return collapsible.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    if (!rootEl)
      return
    const triggerEl = rootEl.querySelector<HTMLButtonElement>('[data-collapsible-trigger]')
    const contentEl = rootEl.querySelector<HTMLElement>('[data-collapsible-content]')

    spreadProps(rootEl, this.api.getRootProps())
    if (triggerEl)
      spreadProps(triggerEl, this.api.getTriggerProps())
    if (contentEl)
      spreadProps(contentEl, this.api.getContentProps())
  }
}

export function render(target: HTMLElement) {
  target.innerHTML = `
    <div class="collapsible-root" data-collapsible-root>
      <button class="collapsible-trigger" data-collapsible-trigger>
        Collapsible Trigger
      </button>
      <div class="collapsible-content" data-collapsible-content>
        <p>${sampleText}</p>
      </div>
    </div>
  `

  const rootEl = target.querySelector<HTMLElement>('[data-collapsible-root]')
  if (!rootEl)
    return

  const instance = new CollapsibleExample(rootEl, { id: 'collapsible:vanilla' })
  instance.init()
}
