import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { BreadcrumbItem, MachineApi, Send, State } from './types'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  return {
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
        role: 'list',
      })
    },

    getItemProps(item: BreadcrumbItem) {
      return normalize.element({
        ...parts.item.attrs,
        'role': 'listitem',
        'aria-label': `breadcrumbs:listitem:${item.label}`,
      })
    },

    getLinkProps(item: BreadcrumbItem) {
      return normalize.element({
        ...parts.link.attrs,
        'role': 'link',
        'aria-current': item.href ? undefined : 'page',
        'data-current': item.href ? undefined : 'page',
        'href': item.href,
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
