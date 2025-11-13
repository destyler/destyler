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

    const rootProps = this.api.getRootProps()
    const triggerProps = this.api.getTriggerProps()
    const contentProps = this.api.getContentProps()

    spreadProps(rootEl, {
      ...rootProps,
      class: ['collapsible-root', rootProps.class].filter(Boolean).join(' '),
    })

    rootEl.innerHTML = `
      <button ${spreadProps(triggerProps)}>
        Collapsible Trigger
      </button>
      <div ${spreadProps(contentProps)}>
        <p>
          Lorem dfd dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna sfsd. Ut enim ad minimdfd v eniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
          id est laborum.
          <a href="#">Some Link</a>
        </p>
      </div>
    `
  }
}

export function render(target: HTMLElement) {
  target.innerHTML = `
    <div destyler-collapsible-root></div>
  `

  const rootEl = target.querySelector<HTMLElement>('[destyler-collapsible-root]')
  if (!rootEl)
    return

  const instance = new CollapsibleExample(rootEl, { id: 'collapsible:vanilla' })
  instance.init()
}
