import type { BreadcrumbItem } from '../../index'
import type { State as BreadcrumbsState } from '../../src/types'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { normalizeProps, spreadProps, useMachine } from '@destyler/vanilla'
import * as breadcrumbs from '../../index'
import '../style.css'

interface ItemNodes {
  itemEl: HTMLElement
  linkEl: HTMLAnchorElement | null
  separatorEl: HTMLElement | null
}

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

export function render(target: HTMLElement) {
  const items: BreadcrumbItem[] = [
    { id: '1', label: 'one', href: '/' },
    { id: '2', label: 'two', href: '/products' },
    { id: '3', label: 'three' },
  ]

  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <nav class="breadcrumbs-root" data-breadcrumb-root>
      <ol class="breadcrumbs-list" data-breadcrumb-list>
        ${items
          .map(
            item => `
              <li class="breadcrumbs-item" data-breadcrumb-item data-item-id="${item.id}">
                <a class="breadcrumbs-link" data-breadcrumb-link>
                  ${item.label}
                </a>
                ${item.href ? '<span class="breadcrumbs-separator" data-breadcrumb-separator>/</span>' : ''}
              </li>
            `,
          )
          .join('')}
      </ol>
    </nav>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-breadcrumb-root]')
  const listEl = layout.main.querySelector<HTMLOListElement>('[data-breadcrumb-list]')
  if (!rootEl || !listEl)
    return

  const itemNodes = new Map<string, ItemNodes>()
  layout.main.querySelectorAll<HTMLElement>('[data-breadcrumb-item]').forEach((itemEl) => {
    const id = itemEl.dataset.itemId
    if (!id)
      return
    itemNodes.set(id, {
      itemEl,
      linkEl: itemEl.querySelector<HTMLAnchorElement>('[data-breadcrumb-link]'),
      separatorEl: itemEl.querySelector<HTMLElement>('[data-breadcrumb-separator]'),
    })
  })

  const machine = useMachine(
    breadcrumbs.machine({
      id: 'breadcrumbs:vanilla',
      items,
    }),
  )

  const toolbar = Toolbar()
  layout.root.appendChild(toolbar.root)

  // Sync machine-driven props onto the rendered breadcrumb nodes and update the visualizer.
  const applyState = (state: BreadcrumbsState) => {
    const api = breadcrumbs.connect(state, machine.send, normalizeProps)

    const rootProps = api.getRootProps()
    spreadProps(rootEl, {
      ...rootProps,
      class: classNames('breadcrumbs-root', rootProps.class),
    })

    const listProps = api.getListProps()
    spreadProps(listEl, {
      ...listProps,
      class: classNames('breadcrumbs-list', listProps.class),
    })

    api.items.forEach((item) => {
      const nodes = itemNodes.get(item.id)
      if (!nodes)
        return

      const itemProps = api.getItemProps(item)
      spreadProps(nodes.itemEl, {
        ...itemProps,
        class: classNames('breadcrumbs-item', itemProps.class),
      })

      const linkProps = api.getLinkProps(item)
      if (nodes.linkEl) {
        spreadProps(nodes.linkEl, {
          ...linkProps,
          class: classNames('breadcrumbs-link', linkProps.class),
        })
      }

      if (nodes.separatorEl) {
        const separatorProps = api.getSeparatorProps()
        spreadProps(nodes.separatorEl, {
          ...separatorProps,
          class: classNames('breadcrumbs-separator', separatorProps.class),
        })
      }
    })

    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  applyState(machine.state as BreadcrumbsState)
  machine.service.subscribe(state => applyState(state as BreadcrumbsState))
}
