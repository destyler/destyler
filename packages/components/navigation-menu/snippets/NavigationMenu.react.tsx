import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

export default function NavigationMenu() {
  const [state, send] = useMachine(navigationMenu.machine({ id: useId() }))

  const api = navigationMenu.connect(state, send, normalizeProps)

  return (
    <nav {...api.getRootProps()}>
      <ul {...api.getListProps()}>
        <li {...api.getItemProps({ value: 'getting-started' })}>
          <button {...api.getTriggerProps({ value: 'getting-started' })}>
            Getting started
          </button>
        </li>
        <li {...api.getItemProps({ value: 'components' })}>
          <button {...api.getTriggerProps({ value: 'components' })}>
            Components
          </button>
        </li>
        <li {...api.getItemProps({ value: 'docs' })}>
          <a {...api.getLinkProps({ value: 'docs' })} href="#">
            Documentation
          </a>
        </li>
      </ul>

      <div {...api.getViewportPositionerProps()}>
        {api.open && (
          <div {...api.getViewportProps()}>
            <div {...api.getContentProps({ value: 'getting-started' })}>
              <ul className="grid grid-cols-1 gap-1.5 ml-0! p-0 m-0 mt-0! list-none w-full">
                <li className="mt-0!">
                  <a {...api.getLinkProps({ value: 'intro' })} href="#">
                    <div className="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Introduction</div>
                    <p className="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Framework-agnostic UI component library.</p>
                  </a>
                </li>
                <li className="mt-0!">
                  <a {...api.getLinkProps({ value: 'install' })} href="#">
                    <div className="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Installation</div>
                    <p className="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">How to install and set up the library.</p>
                  </a>
                </li>
                <li className="mt-0!">
                  <a {...api.getLinkProps({ value: 'styling' })} href="#">
                    <div className="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Styling</div>
                    <p className="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Style components with CSS or Tailwind.</p>
                  </a>
                </li>
              </ul>
            </div>

            <div {...api.getContentProps({ value: 'components' })}>
              <ul className="grid grid-cols-2 gap-1.5 ml-0! p-0 m-0 mt-0! list-none w-full">
                <li className="mt-0!">
                  <a {...api.getLinkProps({ value: 'dialog' })} href="#">
                    <div className="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Dialog</div>
                    <p className="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">A modal dialog component.</p>
                  </a>
                </li>
                <li className="mt-0!">
                  <a {...api.getLinkProps({ value: 'popover' })} href="#">
                    <div className="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Popover</div>
                    <p className="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Floating content anchored to trigger.</p>
                  </a>
                </li>
                <li className="mt-0!">
                  <a {...api.getLinkProps({ value: 'tabs' })} href="#">
                    <div className="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Tabs</div>
                    <p className="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Organize content into tabs.</p>
                  </a>
                </li>
                <li className="mt-0!">
                  <a {...api.getLinkProps({ value: 'tooltip' })} href="#">
                    <div className="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Tooltip</div>
                    <p className="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Display info on hover or focus.</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
