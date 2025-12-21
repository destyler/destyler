import type { MachineContext, MachineState, UserDefinedContext, VirtualItem, VirtualScrollState } from './types'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'
import { dom } from './dom'

/* -----------------------------------------------------------------------------
 * Virtual Scroll Helpers
 * ----------------------------------------------------------------------------- */

function getItemSize(ctx: MachineContext, index: number): number {
  if (!ctx.virtual)
    return 0

  // Check cache first
  const cached = ctx.itemSizeCache.get(index)
  if (cached !== undefined)
    return cached

  const { itemSize } = ctx.virtual
  return typeof itemSize === 'function' ? itemSize(index) : itemSize
}

function calculateTotalSize(ctx: MachineContext): number {
  if (!ctx.virtual)
    return 0

  const { count, itemSize } = ctx.virtual

  if (typeof itemSize === 'number') {
    return count * itemSize
  }

  let total = 0
  for (let i = 0; i < count; i++) {
    total += getItemSize(ctx, i)
  }
  return total
}

function findStartIndex(ctx: MachineContext, scrollOffset: number): number {
  if (!ctx.virtual)
    return 0

  const { count, itemSize } = ctx.virtual

  if (typeof itemSize === 'number') {
    return Math.floor(scrollOffset / itemSize)
  }

  // Binary search for variable size items
  let low = 0
  let high = count - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    // Calculate offset to mid
    let midOffset = 0
    for (let i = 0; i < mid; i++) {
      midOffset += getItemSize(ctx, i)
    }

    if (midOffset < scrollOffset) {
      low = mid + 1
    }
    else if (midOffset > scrollOffset) {
      high = mid - 1
    }
    else {
      return mid
    }
  }

  return Math.max(0, low - 1)
}

function getOffsetForIndex(ctx: MachineContext, index: number): number {
  if (!ctx.virtual)
    return 0

  const { itemSize } = ctx.virtual

  if (typeof itemSize === 'number') {
    return index * itemSize
  }

  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += getItemSize(ctx, i)
  }
  return offset
}

function calculateVirtualState(ctx: MachineContext, scrollOffset: number): VirtualScrollState {
  if (!ctx.virtual) {
    return {
      scrollOffset: 0,
      totalSize: 0,
      virtualItems: [],
      range: { startIndex: 0, endIndex: 0 },
    }
  }

  const { count, overscan = 3, orientation = 'vertical' } = ctx.virtual
  const viewportSize = orientation === 'vertical' ? ctx.viewportHeight : ctx.viewportWidth

  const startIndex = findStartIndex(ctx, scrollOffset)
  const startOffset = getOffsetForIndex(ctx, startIndex)

  const items: VirtualItem[] = []
  let currentOffset = startOffset
  let endIndex = startIndex

  // Find items that fit in the viewport plus overscan
  for (let i = startIndex; i < count; i++) {
    const size = getItemSize(ctx, i)
    const item: VirtualItem = {
      index: i,
      start: currentOffset,
      end: currentOffset + size,
      size,
    }
    items.push(item)
    currentOffset += size
    endIndex = i

    if (currentOffset >= scrollOffset + viewportSize) {
      break
    }
  }

  // Add overscan items
  const overscanStart = Math.max(0, startIndex - overscan)
  const overscanEnd = Math.min(count - 1, endIndex + overscan)

  const finalItems: VirtualItem[] = []

  // Add items before startIndex (overscan)
  for (let i = overscanStart; i < startIndex; i++) {
    const size = getItemSize(ctx, i)
    const start = getOffsetForIndex(ctx, i)
    finalItems.push({
      index: i,
      start,
      end: start + size,
      size,
    })
  }

  // Add visible items
  finalItems.push(...items)

  // Add items after endIndex (overscan)
  let afterOffset = items.length > 0 ? items[items.length - 1].end : getOffsetForIndex(ctx, endIndex + 1)
  for (let i = endIndex + 1; i <= overscanEnd; i++) {
    const size = getItemSize(ctx, i)
    finalItems.push({
      index: i,
      start: afterOffset,
      end: afterOffset + size,
      size,
    })
    afterOffset += size
  }

  const totalSize = calculateTotalSize(ctx)

  return {
    scrollOffset,
    totalSize,
    virtualItems: finalItems,
    range: { startIndex: overscanStart, endIndex: overscanEnd },
  }
}

/* -----------------------------------------------------------------------------
 * Machine
 * ----------------------------------------------------------------------------- */

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)

  return createMachine<MachineContext, MachineState>(
    {
      id: 'scroll-area',
      initial: 'idle',

      context: {
        ...ctx,
        type: ctx.type ?? 'hover',
        scrollHideDelay: ctx.scrollHideDelay ?? 600,
        scrollTop: 0,
        scrollLeft: 0,
        viewportWidth: 0,
        viewportHeight: 0,
        contentWidth: 0,
        contentHeight: 0,
        scrollbarXVisible: false,
        scrollbarYVisible: false,
        isScrolling: false,
        isHovering: false,
        isDragging: false,
        draggingAxis: null,
        pointerStartPosition: 0,
        scrollStartPosition: 0,
        virtualState: null,
        itemSizeCache: new Map(),
      },

      computed: {
        isRtl: ctx => ctx.dir === 'rtl',
        hasOverflowX: ctx => ctx.contentWidth > ctx.viewportWidth,
        hasOverflowY: ctx => ctx.contentHeight > ctx.viewportHeight,
        thumbXSize: (ctx) => {
          if (ctx.contentWidth === 0)
            return 0
          return Math.max((ctx.viewportWidth / ctx.contentWidth) * 100, 10)
        },
        thumbYSize: (ctx) => {
          if (ctx.contentHeight === 0)
            return 0
          return Math.max((ctx.viewportHeight / ctx.contentHeight) * 100, 10)
        },
        thumbXPosition: (ctx) => {
          const maxScroll = ctx.contentWidth - ctx.viewportWidth
          if (maxScroll === 0)
            return 0
          return (ctx.scrollLeft / maxScroll) * (100 - ctx.thumbXSize)
        },
        thumbYPosition: (ctx) => {
          const maxScroll = ctx.contentHeight - ctx.viewportHeight
          if (maxScroll === 0)
            return 0
          return (ctx.scrollTop / maxScroll) * (100 - ctx.thumbYSize)
        },
        isVirtual: ctx => !!ctx.virtual,
      },

      entry: ['setupResizeObserver', 'initVirtualState'],

      exit: ['cleanupResizeObserver'],

      on: {
        SCROLL: {
          actions: ['updateScrollPosition', 'updateVirtualState', 'invokeOnScroll'],
        },
        RESIZE: {
          actions: ['updateDimensions', 'updateScrollbarVisibility', 'updateVirtualState'],
        },
        SCROLL_TO: {
          actions: ['scrollTo'],
        },
        SCROLL_TO_INDEX: {
          actions: ['scrollToIndex'],
        },
        MEASURE_ITEM: {
          actions: ['measureItem', 'updateVirtualState'],
        },
      },

      states: {
        idle: {
          tags: ['idle'],
          on: {
            POINTER_ENTER: {
              target: 'hovering',
              actions: ['setHovering'],
            },
            SCROLL_START: {
              target: 'scrolling',
              actions: ['setScrolling'],
            },
          },
        },

        hovering: {
          tags: ['interacting'],
          on: {
            POINTER_LEAVE: {
              target: 'idle',
              actions: ['clearHovering'],
            },
            SCROLL_START: {
              target: 'scrolling',
              actions: ['setScrolling'],
            },
            THUMB_POINTER_DOWN: {
              target: 'dragging',
              actions: ['startDrag'],
            },
          },
        },

        scrolling: {
          tags: ['interacting'],
          after: {
            SCROLL_HIDE_DELAY: {
              target: 'idle',
              actions: ['clearScrolling'],
            },
          },
          on: {
            SCROLL: {
              target: 'scrolling',
              actions: ['updateScrollPosition', 'updateVirtualState', 'invokeOnScroll'],
            },
            POINTER_ENTER: {
              actions: ['setHovering'],
            },
            POINTER_LEAVE: {
              actions: ['clearHovering'],
            },
            THUMB_POINTER_DOWN: {
              target: 'dragging',
              actions: ['startDrag'],
            },
          },
        },

        dragging: {
          tags: ['interacting'],
          on: {
            POINTER_MOVE: {
              actions: ['updateDrag'],
            },
            POINTER_UP: {
              target: 'hovering',
              actions: ['endDrag'],
            },
          },
        },
      },
    },
    {
      delays: {
        SCROLL_HIDE_DELAY: ctx => ctx.scrollHideDelay ?? 600,
      },

      guards: {},

      actions: {
        setupResizeObserver(ctx) {
          const viewport = dom.getViewportEl(ctx)
          const content = dom.getContentEl(ctx)
          if (!viewport || !content)
            return

          const updateDimensions = () => {
            ctx.viewportWidth = viewport.clientWidth
            ctx.viewportHeight = viewport.clientHeight
            ctx.contentWidth = content.scrollWidth
            ctx.contentHeight = content.scrollHeight
          }

          updateDimensions()

          const resizeObserver = new ResizeObserver(updateDimensions)
          resizeObserver.observe(viewport)
          resizeObserver.observe(content)

          // Store for cleanup
          ;(ctx as any)._resizeObserver = resizeObserver
        },

        cleanupResizeObserver(ctx) {
          const observer = (ctx as any)._resizeObserver as ResizeObserver | undefined
          observer?.disconnect()
        },

        initVirtualState(ctx) {
          if (!ctx.virtual)
            return

          const initialOffset = ctx.virtual.initialOffset ?? 0
          ctx.virtualState = calculateVirtualState(ctx, initialOffset)
        },

        updateScrollPosition(ctx, evt) {
          ctx.scrollTop = evt.scrollTop ?? ctx.scrollTop
          ctx.scrollLeft = evt.scrollLeft ?? ctx.scrollLeft
        },

        updateVirtualState(ctx) {
          if (!ctx.virtual)
            return

          const orientation = ctx.virtual.orientation ?? 'vertical'
          const scrollOffset = orientation === 'vertical' ? ctx.scrollTop : ctx.scrollLeft

          const prevRange = ctx.virtualState?.range
          ctx.virtualState = calculateVirtualState(ctx, scrollOffset)

          // Notify if range changed
          if (prevRange && ctx.virtual.onRangeChange) {
            const newRange = ctx.virtualState.range
            if (prevRange.startIndex !== newRange.startIndex || prevRange.endIndex !== newRange.endIndex) {
              ctx.virtual.onRangeChange(newRange)
            }
          }
        },

        updateDimensions(ctx, evt) {
          if (evt.viewportWidth !== undefined)
            ctx.viewportWidth = evt.viewportWidth
          if (evt.viewportHeight !== undefined)
            ctx.viewportHeight = evt.viewportHeight
          if (evt.contentWidth !== undefined)
            ctx.contentWidth = evt.contentWidth
          if (evt.contentHeight !== undefined)
            ctx.contentHeight = evt.contentHeight
        },

        updateScrollbarVisibility(ctx) {
          const type = ctx.type ?? 'hover'

          switch (type) {
            case 'always':
              ctx.scrollbarXVisible = ctx.hasOverflowX
              ctx.scrollbarYVisible = ctx.hasOverflowY
              break
            case 'auto':
              ctx.scrollbarXVisible = ctx.hasOverflowX
              ctx.scrollbarYVisible = ctx.hasOverflowY
              break
            case 'scroll':
              ctx.scrollbarXVisible = ctx.hasOverflowX && ctx.isScrolling
              ctx.scrollbarYVisible = ctx.hasOverflowY && ctx.isScrolling
              break
            case 'hover':
              ctx.scrollbarXVisible = ctx.hasOverflowX && (ctx.isHovering || ctx.isScrolling || ctx.isDragging)
              ctx.scrollbarYVisible = ctx.hasOverflowY && (ctx.isHovering || ctx.isScrolling || ctx.isDragging)
              break
          }
        },

        invokeOnScroll(ctx) {
          ctx.onScroll?.({
            scrollTop: ctx.scrollTop,
            scrollLeft: ctx.scrollLeft,
            scrollHeight: ctx.contentHeight,
            scrollWidth: ctx.contentWidth,
            clientHeight: ctx.viewportHeight,
            clientWidth: ctx.viewportWidth,
          })
        },

        setHovering(ctx) {
          ctx.isHovering = true
        },

        clearHovering(ctx) {
          ctx.isHovering = false
        },

        setScrolling(ctx) {
          ctx.isScrolling = true
        },

        clearScrolling(ctx) {
          ctx.isScrolling = false
        },

        startDrag(ctx, evt) {
          ctx.isDragging = true
          ctx.draggingAxis = evt.orientation
          ctx.pointerStartPosition = evt.orientation === 'vertical' ? evt.clientY : evt.clientX
          ctx.scrollStartPosition = evt.orientation === 'vertical' ? ctx.scrollTop : ctx.scrollLeft
        },

        updateDrag(ctx, evt) {
          if (!ctx.isDragging || !ctx.draggingAxis)
            return

          const viewport = dom.getViewportEl(ctx)
          if (!viewport)
            return

          const delta = ctx.draggingAxis === 'vertical'
            ? evt.clientY - ctx.pointerStartPosition
            : evt.clientX - ctx.pointerStartPosition

          const scrollbarSize = ctx.draggingAxis === 'vertical' ? ctx.viewportHeight : ctx.viewportWidth
          const contentSize = ctx.draggingAxis === 'vertical' ? ctx.contentHeight : ctx.contentWidth
          const maxScroll = contentSize - scrollbarSize

          const thumbSize = ctx.draggingAxis === 'vertical' ? ctx.thumbYSize : ctx.thumbXSize
          const trackSize = scrollbarSize
          const thumbPixelSize = (thumbSize / 100) * trackSize
          const availableTrack = trackSize - thumbPixelSize

          const scrollDelta = (delta / availableTrack) * maxScroll
          const newScroll = Math.max(0, Math.min(maxScroll, ctx.scrollStartPosition + scrollDelta))

          if (ctx.draggingAxis === 'vertical') {
            viewport.scrollTop = newScroll
          }
          else {
            viewport.scrollLeft = newScroll
          }
        },

        endDrag(ctx) {
          ctx.isDragging = false
          ctx.draggingAxis = null
        },

        scrollTo(ctx, evt) {
          const viewport = dom.getViewportEl(ctx)
          if (!viewport)
            return

          viewport.scrollTo({
            top: evt.top,
            left: evt.left,
            behavior: evt.behavior ?? 'auto',
          })
        },

        scrollToIndex(ctx, evt) {
          if (!ctx.virtual)
            return

          const viewport = dom.getViewportEl(ctx)
          if (!viewport)
            return

          const { index, align = 'auto' } = evt
          const orientation = ctx.virtual.orientation ?? 'vertical'
          const viewportSize = orientation === 'vertical' ? ctx.viewportHeight : ctx.viewportWidth

          const itemOffset = getOffsetForIndex(ctx, index)
          const itemSize = getItemSize(ctx, index)
          const currentScroll = orientation === 'vertical' ? ctx.scrollTop : ctx.scrollLeft

          let targetScroll: number

          switch (align) {
            case 'start':
              targetScroll = itemOffset
              break
            case 'center':
              targetScroll = itemOffset - (viewportSize - itemSize) / 2
              break
            case 'end':
              targetScroll = itemOffset - viewportSize + itemSize
              break
            case 'auto':
            default:
              if (itemOffset < currentScroll) {
                targetScroll = itemOffset
              }
              else if (itemOffset + itemSize > currentScroll + viewportSize) {
                targetScroll = itemOffset - viewportSize + itemSize
              }
              else {
                return // Already visible
              }
          }

          const maxScroll = (orientation === 'vertical' ? ctx.contentHeight : ctx.contentWidth) - viewportSize
          targetScroll = Math.max(0, Math.min(maxScroll, targetScroll))

          if (orientation === 'vertical') {
            viewport.scrollTop = targetScroll
          }
          else {
            viewport.scrollLeft = targetScroll
          }
        },

        measureItem(ctx, evt) {
          if (!ctx.virtual)
            return

          ctx.itemSizeCache.set(evt.index, evt.size)
        },
      },
    },
  )
}
