import type { Machine, StateMachine } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export interface ValueChangeDetails {
  value: string[]
}

export interface FocusChangeDetails {
  value: string | null
}

export type ElementIds = Partial<{
  root: string
  item: (value: string) => string
  itemContent: (value: string) => string
  itemTrigger: (value: string) => string
}>

interface PublicContext extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the collapse. Useful for composition.
   */
  ids?: ElementIds | undefined
  /**
   * Whether multiple collapse items can be expanded at the same time.
   * @default false
   */
  multiple?: boolean | undefined
  /**
   * Whether an collapse item can be closed after it has been expanded.
   * @default true
   */
  collapsible?: boolean | undefined
  /**
   * The `value` of the collapse items that are currently being expanded.
   */
  value: string[]
  /**
   * Whether the collapse items are disabled
   */
  disabled?: boolean | undefined
  /**
   * The callback fired when the state of expanded/collapsed collapse items changes.
   */
  onValueChange?: (details: ValueChangeDetails) => void
  /**
   * The callback fired when the focused collapse item changes.
   */
  onFocusChange?: (details: FocusChangeDetails) => void
  /**
   *  The orientation of the collapse items.
   *  @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical' | undefined
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

type ComputedContext = Readonly<{
  /**
   * Whether the collapse items are horizontal.
   */
  isHorizontal: boolean
}>

interface PrivateContext {
  /**
   * The `id` of the focused collapse item.
   */
  focusedValue: string | null
}

export interface MachineContext extends PublicContext, PrivateContext, ComputedContext {}

export interface MachineState {
  value: 'idle' | 'focused'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export type Service = Machine<MachineContext, MachineState, StateMachine.AnyEventObject>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ItemProps {
  /**
   * The value of the collapse item.
   */
  value: string
  /**
   * Whether the collapse item is disabled.
   */
  disabled?: boolean | undefined
}

export interface ItemState {
  /**
   * Whether the collapse item is expanded.
   */
  expanded: boolean
  /**
   * Whether the collapse item is focused.
   */
  focused: boolean
  /**
   * Whether the collapse item is disabled.
   */
  disabled: boolean
}

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * The value of the focused collapse item.
   */
  focusedValue: string | null
  /**
   * The value of the collapse
   */
  value: string[]
  /**
   * Sets the value of the collapse.
   */
  setValue: (value: string[]) => void
  /**
   * Gets the state of an collapse item.
   */
  getItemState: (props: ItemProps) => ItemState

  getRootProps: () => T['element']
  getItemProps: (props: ItemProps) => T['element']
  getItemContentProps: (props: ItemProps) => T['element']
  getItemTriggerProps: (props: ItemProps) => T['button']
  getItemIndicatorProps: (props: ItemProps) => T['element']
}
