/** @jsxImportSource solid-js */
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import '../../styles/components/breadcrumbs.css'

export default function Breadcrumbs() {
  const items: BreadcrumbItem[] = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Components', href: '/components/checkbox' },
    { id: '3', label: 'Breadcrumbs' },
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
      <ol {...api().getListProps()}>
        <For each={api().items}>
          {item => (
            <li {...api().getItemProps(item)}>
              <a {...api().getLinkProps(item)}>
                {item.label}
              </a>
              {item.href && <span {...api().getSeparatorProps()}></span>}
            </li>
          )}
        </For>
      </ol>
    </nav>
  )
}
