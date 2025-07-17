import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/breadcrumbs.css'

export default function Breadcrumbs() {
  const items: BreadcrumbItem[] = [
    { id: '1', label: 'one', href: '/' },
    { id: '2', label: 'two', href: '/products' },
    { id: '3', label: 'three' },
  ]

  const [state, send] = useMachine(
    breadcrumbs.machine({
      id: useId(),
      items,
    }),
  )

  const api = breadcrumbs.connect(state, send, normalizeProps)

  return (
    <nav {...api.getRootProps()}>
      <ol {...api.getListProps()} className="breadcrumbs-root">
        {api.items.map(item => (
          <li {...api.getItemProps(item)} key={item.id}>
            <a {...api.getLinkProps(item)} className="breadcrumbs-link">
              {item.label}
            </a>
            {item.href && <span {...api.getSeparatorProps()}>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
