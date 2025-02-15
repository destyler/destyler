import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createUniqueId, For } from 'solid-js'

export default function Breadcrumbs() {
  const items: BreadcrumbItem[] = [
    { id: '1', label: 'one', href: '/' },
    { id: '2', label: 'two', href: '/products' },
    { id: '3', label: 'three' },
  ]

  const [state, send] = useMachine(
    breadcrumbs.machine({
      id: createUniqueId(),
      items,
    }),
  )

  const api = breadcrumbs.connect(state, send, normalizeProps)

  return (
    <nav {...api.getRootProps()}>
      <ol {...api.getListProps()} class="flex items-center space-x-2">
        <For each={api.items}>
          {item => (
            <li {...api.getItemProps(item)}>
              <a {...api.getLinkProps(item)} class="text-blue-500 hover:underline">
                {item.label}
              </a>
              {item.href && <span {...api.getSeparatorProps()}>/</span>}
            </li>
          )}
        </For>
      </ol>
    </nav>
  )
}
