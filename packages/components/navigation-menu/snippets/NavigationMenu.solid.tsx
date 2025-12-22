/** @jsxImportSource solid-js */
import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, Show } from 'solid-js'
import './style.css'

export default function NavigationMenu() {
  const [state, send] = useMachine(navigationMenu.machine({ id: createUniqueId() }))

  const api = createMemo(() => navigationMenu.connect(state, send, normalizeProps))

  return (
    <nav {...api().getRootProps()}>
      <ul {...api().getListProps()}>
        <li {...api().getItemProps({ value: 'getting-started' })}>
          <button {...api().getTriggerProps({ value: 'getting-started' })}>
            Getting started
          </button>
        </li>
        <li {...api().getItemProps({ value: 'components' })}>
          <button {...api().getTriggerProps({ value: 'components' })}>
            Components
          </button>
        </li>
        <li {...api().getItemProps({ value: 'docs' })}>
          <a {...api().getLinkProps({ value: 'docs' })} href="#">
            Documentation
          </a>
        </li>
      </ul>

      <div {...api().getViewportPositionerProps()}>
        <Show when={api().open}>
          <div {...api().getViewportProps()}>
            <div {...api().getContentProps({ value: 'getting-started' })}>
              <ul class="grid grid-cols-1 gap-1.5 ml-0! p-0 m-0 mt-0! list-none w-full">
                <li class="mt-0!">
                  <a {...api().getLinkProps({ value: 'intro' })} href="#">
                    <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Introduction</div>
                    <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Framework-agnostic UI component library.</p>
                  </a>
                </li>
                <li class="mt-0!">
                  <a {...api().getLinkProps({ value: 'install' })} href="#">
                    <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Installation</div>
                    <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">How to install and set up the library.</p>
                  </a>
                </li>
                <li class="mt-0!">
                  <a {...api().getLinkProps({ value: 'styling' })} href="#">
                    <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Styling</div>
                    <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Style components with CSS or Tailwind.</p>
                  </a>
                </li>
              </ul>
            </div>

            <div {...api().getContentProps({ value: 'components' })}>
              <ul class="grid grid-cols-2 gap-1.5 ml-0! p-0 m-0 mt-0! list-none w-full">
                <li class="mt-0!">
                  <a {...api().getLinkProps({ value: 'dialog' })} href="#">
                    <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Dialog</div>
                    <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">A modal dialog component.</p>
                  </a>
                </li>
                <li class="mt-0!">
                  <a {...api().getLinkProps({ value: 'popover' })} href="#">
                    <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Popover</div>
                    <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Floating content anchored to trigger.</p>
                  </a>
                </li>
                <li class="mt-0!">
                  <a {...api().getLinkProps({ value: 'tabs' })} href="#">
                    <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Tabs</div>
                    <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Organize content into tabs.</p>
                  </a>
                </li>
                <li class="mt-0!">
                  <a {...api().getLinkProps({ value: 'tooltip' })} href="#">
                    <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Tooltip</div>
                    <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Display info on hover or focus.</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  )
}
