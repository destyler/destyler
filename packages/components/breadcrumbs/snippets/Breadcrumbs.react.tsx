import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

export default function Breadcrumbs() {
  const items: BreadcrumbItem[] = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Components', href: '/components/checkbox' },
    { id: '3', label: 'Breadcrumbs' },
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
      <ol {...api.getListProps()}>
        {api.items.map(item => (
          <li {...api.getItemProps(item)} key={item.id}>
            <a {...api.getLinkProps(item)}>
              {item.label}
            </a>
            {item.href && <span {...api.getSeparatorProps()} />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
