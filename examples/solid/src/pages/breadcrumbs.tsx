/** @jsxImportSource solid-js */
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import '@destyler/shared-private/styles/breadcrumbs.css'

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

  const api = createMemo(() => breadcrumbs.connect(state, send, normalizeProps))

  return (
    <nav {...api().getRootProps()}>
      <ol {...api().getListProps()} class="breadcrumbs-root">
        <For each={api().items}>
          {item => (
            <li {...api().getItemProps(item)}>
              <a {...api().getLinkProps(item)} class="breadcrumbs-link">
                {item.label}
              </a>
              {item.href && <span {...api().getSeparatorProps()}>/</span>}
            </li>
          )}
        </For>
      </ol>
    </nav>
  )
}
