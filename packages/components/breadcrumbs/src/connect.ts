import type { NormalizeProps, PropTypes } from '@destyler/types'
import type { BreadcrumbItem, MachineApi, Send, State } from './types'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  return {
    hoveredId: state.context.hoveredId,
    focusedId: state.context.focusedId,
    items: state.context.items,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'dir': state.context.dir,
        'id': dom.getRootId(state.context),
        'role': 'navigation',
        'aria-label': 'breadcrumbs',
      })
    },

    getListProps() {
      return normalize.element({
        ...parts.list.attrs,
        id: state.context.ids?.list,
        role: 'list',
      })
    },

    getItemProps(item: BreadcrumbItem) {
      return normalize.element({
        ...parts.item.attrs,
        'role': 'listitem',
        'aria-label': `breadcrumbs:listitem:${item.label}`,
        'data-hover': state.context.hoveredId === item.id ? 'true' : 'false',
        'data-focus': state.context.focusedId === item.id ? 'true' : 'false',
      })
    },

    getLinkProps(item: BreadcrumbItem) {
      const current = item.current ?? !item.href
      return normalize.element({
        ...parts.link.attrs,
        'role': item.href ? 'link' : undefined,
        'aria-current': current ? 'page' : undefined,
        'data-current': current ? 'page' : undefined,
        'href': item.href,
        'data-hover': state.context.hoveredId === item.id ? 'true' : 'false',
        'data-focus': state.context.focusedId === item.id ? 'true' : 'false',
        onPointerEnter(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'ITEM.POINTER_OVER', id: item.id })
        },
        onPointerLeave(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'ITEM.POINTER_LEAVE', id: item.id })
        },
        onFocus(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'ITEM.FOCUS', id: item.id })
        },
        onBlur(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'ITEM.BLUR', id: item.id })
        },
      })
    },

    getSeparatorProps() {
      return normalize.element({
        ...parts.separator.attrs,
        'aria-hidden': true,
      })
    },
  }
}
