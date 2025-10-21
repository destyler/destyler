import type { BreadcrumbItem } from '../../index'
import { normalizeProps, useMachine } from '@destyler/react'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as breadcrumbs from '../../index'
import '../style.css'

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
    <Layout>
      <nav {...api.getRootProps()}>
        <ol {...api.getListProps()}>
          {api.items.map(item => (
            <li {...api.getItemProps(item)} key={item.id}>
              <a {...api.getLinkProps(item)}>
                {item.label}
              </a>
              {item.href && <span {...api.getSeparatorProps()}>/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
