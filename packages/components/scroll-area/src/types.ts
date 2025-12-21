import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@destyler/types'
import type { AnyEventObject, Machine, XSend, XState } from '@destyler/xstate'

/* -----------------------------------------------------------------------------
 * Scroll Area Types
 * ----------------------------------------------------------------------------- */

export type ScrollbarVisibility = 'auto' | 'always' | 'scroll' | 'hover'

export type ScrollType = 'auto' | 'always' | 'scroll' | 'hover'

export type Orientation = 'horizontal' | 'vertical'

export interface ScrollDetails {
  /**
   * The current scroll offset from top/left
   */
  scrollTop: number
  scrollLeft: number
}

export interface ScrollChangeDetails extends ScrollDetails {
  /**
   * The maximum scroll offset
   */
  scrollHeight: number
  scrollWidth: number
  /**
   * The viewport size
   */
  clientHeight: number
  clientWidth: number
}

/* -----------------------------------------------------------------------------
 * Virtual Scroll Types
 * ----------------------------------------------------------------------------- */

export interface VirtualItem {
  /**
   * The index of the item in the list
   */
  index: number
  /**
   * The starting position (offset) of the item
   */
  start: number
  /**
   * The ending position of the item
   */
  end: number
  /**
   * The size of the item
   */
  size: number
}

export interface VirtualRange {
  /**
   * The start index of visible items
   */
  startIndex: number
  /**
   * The end index of visible items
   */
  endIndex: number
}

export interface VirtualScrollOptions {
  /**
   * Total number of items in the list
   */
  count: number
  /**
   * The size of each item (height for vertical, width for horizontal)
   * Can be a fixed number or a function that returns the size for each index
   */
  itemSize: number | ((index: number) => number)
  /**
   * Number of items to render before and after the visible range
   * @default 3
   */
  overscan?: number
  /**
   * The scroll direction
   * @default 'vertical'
   */
  orientation?: Orientation
  /**
   * Initial scroll offset
   * @default 0
   */
  initialOffset?: number
  /**
   * Callback when visible range changes
   */
  onRangeChange?: (range: VirtualRange) => void
}

export interface VirtualScrollState {
  /**
   * The current scroll offset
   */
  scrollOffset: number
  /**
   * The total size of all items
   */
  totalSize: number
  /**
   * The currently visible items
   */
  virtualItems: VirtualItem[]
  /**
   * The visible range
   */
  range: VirtualRange
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * ----------------------------------------------------------------------------- */

type ElementIds = Partial<{
  root: string
  viewport: string
  content: string
  scrollbarX: string
  scrollbarY: string
  thumbX: string
  thumbY: string
  corner: string
}>

/* -----------------------------------------------------------------------------
 * Public Context
 * ----------------------------------------------------------------------------- */

interface PublicContext extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the scroll area. Useful for composition.
   */
  ids?: ElementIds | undefined
  /**
   * Describes the nature of scrollbar visibility
   * - `auto`: Scrollbars are visible when content is overflowing
   * - `always`: Scrollbars are always visible
   * - `scroll`: Scrollbars are visible when the user is scrolling
   * - `hover`: Scrollbars are visible when the user is hovering over the scroll area
   * @default 'hover'
   */
  type?: ScrollType | undefined
  /**
   * If type is set to either `scroll` or `hover`, this prop determines the length of time,
   * in milliseconds, before the scrollbars are hidden after the user stops interacting with scrollbars.
   * @default 600
   */
  scrollHideDelay?: number | undefined
  /**
   * Callback when scroll position changes
   */
  onScroll?: ((details: ScrollChangeDetails) => void) | undefined
  /**
   * Virtual scroll configuration. When provided, enables virtual scrolling.
   */
  virtual?: VirtualScrollOptions | undefined
}

/* -----------------------------------------------------------------------------
 * Private Context
 * ----------------------------------------------------------------------------- */

interface PrivateContext {
  /**
   * @internal
   * Current scroll position
   */
  scrollTop: number
  /**
   * @internal
   * Current horizontal scroll position
   */
  scrollLeft: number
  /**
   * @internal
   * Viewport dimensions
   */
  viewportWidth: number
  viewportHeight: number
  /**
   * @internal
   * Content dimensions
   */
  contentWidth: number
  contentHeight: number
  /**
   * @internal
   * Whether scrollbars are visible
   */
  scrollbarXVisible: boolean
  scrollbarYVisible: boolean
  /**
   * @internal
   * Whether the user is scrolling
   */
  isScrolling: boolean
  /**
   * @internal
   * Whether the user is hovering
   */
  isHovering: boolean
  /**
   * @internal
   * Whether the user is dragging the thumb
   */
  isDragging: boolean
  /**
   * @internal
   * Which scrollbar is being dragged
   */
  draggingAxis: Orientation | null
  /**
   * @internal
   * Pointer position when drag started
   */
  pointerStartPosition: number
  /**
   * @internal
   * Scroll position when drag started
   */
  scrollStartPosition: number
  /**
   * @internal
   * Virtual scroll state
   */
  virtualState: VirtualScrollState | null
  /**
   * @internal
   * Cached item sizes for dynamic sizing
   */
  itemSizeCache: Map<number, number>
}

/* -----------------------------------------------------------------------------
 * Computed Context
 * ----------------------------------------------------------------------------- */

type ComputedContext = Readonly<{
  /**
   * @computed
   * Whether the writing direction is rtl
   */
  isRtl: boolean
  /**
   * @computed
   * Whether there is horizontal overflow
   */
  hasOverflowX: boolean
  /**
   * @computed
   * Whether there is vertical overflow
   */
  hasOverflowY: boolean
  /**
   * @computed
   * Scrollbar thumb sizes (percentage)
   */
  thumbXSize: number
  thumbYSize: number
  /**
   * @computed
   * Scrollbar thumb positions (percentage)
   */
  thumbXPosition: number
  thumbYPosition: number
  /**
   * @computed
   * Whether virtual scrolling is enabled
   */
  isVirtual: boolean
}>

/* -----------------------------------------------------------------------------
 * Machine Types
 * ----------------------------------------------------------------------------- */

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export interface MachineContext extends PublicContext, PrivateContext, ComputedContext {}

export interface MachineState {
  value: 'idle' | 'hovering' | 'scrolling' | 'dragging'
  tags: 'idle' | 'interacting'
}

export type State = XState<MachineContext, MachineState>

export type Send = XSend<AnyEventObject>

export type Service = Machine<MachineContext, MachineState, AnyEventObject>

/* -----------------------------------------------------------------------------
 * Scrollbar Props
 * ----------------------------------------------------------------------------- */

export interface ScrollbarProps {
  /**
   * The orientation of the scrollbar
   */
  orientation: Orientation
}

/* -----------------------------------------------------------------------------
 * Machine API
 * ----------------------------------------------------------------------------- */

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * The current scroll position
   */
  scrollTop: number
  scrollLeft: number
  /**
   * Whether there is overflow in each direction
   */
  hasOverflowX: boolean
  hasOverflowY: boolean
  /**
   * Whether scrollbars are currently visible
   */
  scrollbarXVisible: boolean
  scrollbarYVisible: boolean
  /**
   * Scroll to a specific position
   */
  scrollTo: (options: ScrollToOptions) => void
  /**
   * Scroll to a specific item index (for virtual scrolling)
   */
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void
  /**
   * Measure a specific item's size (for dynamic virtual scrolling)
   */
  measureItem: (index: number, size: number) => void
  /**
   * Get virtual scroll state (when virtual scrolling is enabled)
   */
  getVirtualItems: () => VirtualItem[]
  /**
   * Get the total size of all virtual items
   */
  getTotalSize: () => number
  /**
   * Get the visible range of items
   */
  getVisibleRange: () => VirtualRange
  /**
   * Props for the root element
   */
  getRootProps: () => T['element']
  /**
   * Props for the viewport element
   */
  getViewportProps: () => T['element']
  /**
   * Props for the content element (wrapper for virtual items)
   */
  getContentProps: () => T['element']
  /**
   * Props for a scrollbar
   */
  getScrollbarProps: (options: ScrollbarProps) => T['element']
  /**
   * Props for the scrollbar thumb
   */
  getThumbProps: (options: ScrollbarProps) => T['element']
  /**
   * Props for the corner element
   */
  getCornerProps: () => T['element']
}
