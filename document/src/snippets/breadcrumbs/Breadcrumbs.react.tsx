import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

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
      <ol {...api.getListProps()} className="mt-0! flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
        {api.items.map(item => (
          <li {...api.getItemProps(item)} key={item.id} className='inline-flex items-center gap-1.5 mt-0!'>
            <a {...api.getLinkProps(item)} className="transition-colors hover:text-foreground no-underline! data-[current=page]:text-foreground">
              {item.label}
            </a>
            {item.href && <span {...api.getSeparatorProps()} className='i-carbon:chevron-right size-3' />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
