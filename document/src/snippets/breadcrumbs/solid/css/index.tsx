/** @jsxImportSource solid-js */
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import './index.css'

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
      <ol {...api().getListProps()} class="breadcrumb-list">
        <For each={api().items}>
          {item => (
            <li {...api().getItemProps(item)} class="breadcrumb-item">
              <a {...api().getLinkProps(item)} class="breadcrumb-link">
                {item.label}
              </a>
              {item.href && <span {...api().getSeparatorProps()} class="breadcrumb-separator"></span>}
            </li>
          )}
        </For>
      </ol>
    </nav>
  )
}
