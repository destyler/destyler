import type { BreadcrumbItem } from '../../index'
import { normalizeProps, spread, useMachine } from '@destyler/vanilla'
import * as breadcrumb from '../../index'
import '../style.css'

export function render(target: HTMLElement) {
  const items: BreadcrumbItem[] = [
    { id: '1', label: 'one', href: '/' },
    { id: '2', label: 'two', href: '/products' },
    { id: '3', label: 'three' },
  ]
  const machine = useMachine(
    breadcrumb.machine({
      id: '1',
      items,
    }),
  )

  const api = breadcrumb.connect(machine.state, machine.send, normalizeProps)

  target.innerHTML = `
  <nav ${spread(api.getRootProps())}>
    <ol ${spread(api.getListProps())}>
      ${api.items
        .map(
          item => `
        <li ${spread(api.getItemProps(item))}>
          <a ${spread(api.getLinkProps(item))}>
            ${item.label}
          </a>
          ${item.href ? `<span ${spread(api.getSeparatorProps())}>/</span>` : ''}
        </li>
      `,
        )
        .join('')}
    </ol>
  </nav>
  `
}
