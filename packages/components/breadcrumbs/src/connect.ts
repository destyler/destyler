import type { NormalizeProps, PropTypes } from '@destyler/types'
import type { BreadcrumbItem, MachineApi, Send, State } from './types'
import { dataAttr } from '@destyler/dom'
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
        'data-hover': dataAttr(state.context.hoveredId != null),
        'data-focus': dataAttr(state.context.focusedId != null),
      })
    },

    getListProps() {
      return normalize.element({
        ...parts.list.attrs,
        role: 'list',
      })
    },

    getItemProps(item: BreadcrumbItem) {
      return normalize.element({
        ...parts.item.attrs,
        'role': 'listitem',
        'aria-label': `breadcrumbs:listitem:${item.label}`,
        'data-hover': dataAttr(state.context.hoveredId === item.id),
        'data-focus': dataAttr(state.context.focusedId === item.id),
      })
    },

    getLinkProps(item: BreadcrumbItem) {
      return normalize.element({
        ...parts.link.attrs,
        'role': 'link',
        'aria-current': item.href ? undefined : 'page',
        'data-current': item.href ? undefined : 'page',
        'href': item.href,
        'tabIndex': item.href ? undefined : 0,
        'data-hover': dataAttr(state.context.hoveredId === item.id),
        'data-focus': dataAttr(state.context.focusedId === item.id),
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
