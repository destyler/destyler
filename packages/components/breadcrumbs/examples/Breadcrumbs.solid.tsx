/** @jsxImportSource solid-js */
import type { BreadcrumbItem } from '../index'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import * as breadcrumbs from '../index'
import './style.css'

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
    <Layout>
      <nav {...api().getRootProps()}>
        <ol {...api().getListProps()}>
          <For each={api().items}>
            {item => (
              <li {...api().getItemProps(item)}>
                <a {...api().getLinkProps(item)}>
                  {item.label}
                </a>
                {item.href && <span {...api().getSeparatorProps()}>/</span>}
              </li>
            )}
          </For>
        </ol>
      </nav>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>

  )
}
