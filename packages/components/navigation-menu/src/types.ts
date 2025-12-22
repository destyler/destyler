import type { CommonProperties, DirectionProperty, Orientation, PropTypes, RequiredBy } from '@destyler/types'
import type { AnyEventObject, Machine, XSend, XState } from '@destyler/xstate'

export interface ValueChangeDetails {
  value: string | null
}

type ElementIds = Partial<{
  root: string
  list: string
  viewport: string
  viewportPositioner: string
  indicator: string
  trigger: (value: string) => string
  link: (value: string) => string
  content: (value: string) => string
  item: (value: string) => string
}>

interface PublicContext extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the navigation menu. Useful for composition.
   */
  'ids'?: ElementIds | undefined
  /**
   * The value of the currently active menu item.
   */
  'value': string | null
  /**
   * The initial value of the menu item to open when rendered.
   */
  'defaultValue'?: string | undefined
  /**
   * Function called when the active menu item changes.
   */
  'onValueChange'?: ((details: ValueChangeDetails) => void) | undefined
  /**
   * The delay (in ms) before the navigation menu opens when hovering over a trigger.
   * @default 200
   */
  'openDelay': number
  /**
   * The delay (in ms) before the navigation menu closes when the pointer leaves.
   * @default 300
   */
  'closeDelay': number
  /**
   * The orientation of the navigation menu.
   * @default "horizontal"
   */
  'orientation': Orientation
  /**
   * Whether the value is controlled by the user
   */
  'value.controlled'?: boolean | undefined
  /**
   * Whether to disable click interaction on triggers.
   * @default false
   */
  'disableClickTrigger': boolean
  /**
   * Whether to disable hover interaction on triggers.
   * @default false
   */
  'disableHoverTrigger': boolean
  /**
   * Whether to disable closing when the pointer leaves the menu.
   * @default false
   */
  'disablePointerLeaveClose': boolean
}

interface PrivateContext {
  /**
   * @internal
   * The previously active value before closing
   */
  previousValue: string | null
  /**
   * @internal
   * Timer for open delay
   */
  openTimer: ReturnType<typeof setTimeout> | null
  /**
   * @internal
   * Timer for close delay
   */
  closeTimer: ReturnType<typeof setTimeout> | null
  /**
   * @internal
   * Whether the viewport is currently being hovered
   */
  isViewportHovered: boolean
  /**
   * @internal
   * Whether any trigger is currently being hovered
   */
  isTriggerHovered: boolean
}

type ComputedContext = Readonly<{
  /**
   * @computed
   * Whether the writing direction is rtl
   */
  isRtl: boolean
  /**
   * @computed
   * Whether the orientation is horizontal
   */
  isHorizontal: boolean
  /**
   * @computed
   * Whether a menu item is currently open
   */
  isOpen: boolean
}>

export interface MachineContext extends PublicContext, PrivateContext, ComputedContext {}

export interface MachineState {
  value: 'idle' | 'open'
  tags: 'open' | 'closed'
}

export type State = XState<MachineContext, MachineState>

export type Send = XSend<AnyEventObject>

export type Service = Machine<MachineContext, MachineState, AnyEventObject>

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export interface TriggerProps {
  /**
   * The unique value of the menu item.
   */
  value: string
  /**
   * Whether the trigger is disabled
   */
  disabled?: boolean | undefined
}

export interface ContentProps {
  /**
   * The unique value of the menu item.
   */
  value: string
}

export interface ItemProps {
  /**
   * The unique value of the menu item.
   */
  value: string
}

export interface LinkProps {
  /**
   * The unique value of the menu item.
   */
  value: string
  /**
   * Whether the link is currently active (current page)
   */
  active?: boolean | undefined
  /**
   * Function called when the link is selected
   */
  onSelect?: () => void
}

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * The current active value
   */
  value: string | null
  /**
   * The previously active value (for animation direction)
   */
  previousValue: string | null
  /**
   * Whether a menu item is currently open
   */
  open: boolean
  /**
   * Function to set the value
   */
  setValue: (value: string | null) => void
  /**
   * Returns the state of a trigger
   */
  getTriggerState: (props: TriggerProps) => { open: boolean, disabled: boolean }
  /**
   * Returns the state of a content
   */
  getContentState: (props: ContentProps) => { open: boolean, motion: 'from-start' | 'from-end' | 'to-start' | 'to-end' | undefined }

  getRootProps: () => T['element']
  getListProps: () => T['element']
  getItemProps: (props: ItemProps) => T['element']
  getTriggerProps: (props: TriggerProps) => T['button']
  getContentProps: (props: ContentProps) => T['element']
  getLinkProps: (props: LinkProps) => T['element']
  getIndicatorProps: () => T['element']
  getViewportPositionerProps: () => T['element']
  getViewportProps: () => T['element']
  getArrowProps: () => T['element']
}
