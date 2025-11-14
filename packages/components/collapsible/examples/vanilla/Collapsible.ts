import type { ContextFrom } from '@destyler/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as collapsible from '../../index'
import '../style.css'

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
        <p>
          Lorem dfd dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna sfsd. Ut enim ad minimdfd v eniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
          id est laborum.
          <a href="#">Some Link</a>
        </p>
      </div>
    </div>
  `

  const rootEl = target.querySelector<HTMLElement>('[data-collapsible-root]')
  if (!rootEl)
    return

  const instance = new CollapsibleExample(rootEl, { id: 'collapsible:vanilla' })
  instance.init()
}
