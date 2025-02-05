import type { StateMachine } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

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

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  items: BreadcrumbItem[]
  getRootProps: () => T['element']
  getListProps: () => T['element']
  getItemProps: (item: BreadcrumbItem) => T['element']
  getLinkProps: (item: BreadcrumbItem) => T['element']
  getSeparatorProps: () => T['element']
}
