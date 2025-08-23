import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@destyler/types'
import type { AnyEventObject, XSend, XState } from '@destyler/xstate'

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
}

export type ElementIds = Partial<{
  root: string
  list: string
  separator: string
}>

interface PublicContext extends CommonProperties, DirectionProperty {
  /**
   * 面包屑项目
   */
  items: BreadcrumbItem[]
  /**
   * DOM 元素的 ID
   */
  ids?: ElementIds
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export interface MachineContext extends PublicContext {}

export interface MachineState {
  value: 'idle'
}

export type State = XState<MachineContext, MachineState>

export type Send = XSend<AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  items: BreadcrumbItem[]
  getRootProps: () => T['element']
  getListProps: () => T['element']
  getItemProps: (item: BreadcrumbItem) => T['element']
  getLinkProps: (item: BreadcrumbItem) => T['element']
  getSeparatorProps: () => T['element']
}
