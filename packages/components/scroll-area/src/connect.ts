import type { NormalizeProps, PropTypes } from '@destyler/types'
import type { MachineApi, ScrollbarProps, Send, State, VirtualItem, VirtualRange } from './types'
import { dataAttr } from '@destyler/dom'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  const ctx = state.context
  const isInteracting = state.hasTag('interacting')

  const scrollbarXVisible = (() => {
    const type = ctx.type ?? 'hover'
    switch (type) {
      case 'always':
        return ctx.hasOverflowX
      case 'auto':
        return ctx.hasOverflowX
      case 'scroll':
        return ctx.hasOverflowX && ctx.isScrolling
      case 'hover':
        return ctx.hasOverflowX && isInteracting
    }
  })()

  const scrollbarYVisible = (() => {
    const type = ctx.type ?? 'hover'
    switch (type) {
      case 'always':
        return ctx.hasOverflowY
      case 'auto':
        return ctx.hasOverflowY
      case 'scroll':
        return ctx.hasOverflowY && ctx.isScrolling
      case 'hover':
        return ctx.hasOverflowY && isInteracting
    }
  })()

  return {
    scrollTop: ctx.scrollTop,
    scrollLeft: ctx.scrollLeft,
    hasOverflowX: ctx.hasOverflowX,
    hasOverflowY: ctx.hasOverflowY,
    scrollbarXVisible,
    scrollbarYVisible,

    scrollTo(options) {
      send({ type: 'SCROLL_TO', ...options })
    },

    scrollToIndex(index, options = {}) {
      send({ type: 'SCROLL_TO_INDEX', index, ...options })
    },

    measureItem(index, size) {
      send({ type: 'MEASURE_ITEM', index, size })
    },

    getVirtualItems(): VirtualItem[] {
      return ctx.virtualState?.virtualItems ?? []
    },

    getTotalSize(): number {
      return ctx.virtualState?.totalSize ?? 0
    },

    getVisibleRange(): VirtualRange {
      return ctx.virtualState?.range ?? { startIndex: 0, endIndex: 0 }
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(ctx),
        'dir': ctx.dir,
        'data-orientation': ctx.virtual?.orientation ?? 'vertical',
        'style': {
          position: 'relative',
          overflow: 'hidden',
        },
        onPointerEnter() {
          send('POINTER_ENTER')
        },
        onPointerLeave() {
          send('POINTER_LEAVE')
        },
      })
    },

    getViewportProps() {
      return normalize.element({
        ...parts.viewport.attrs,
        'id': dom.getViewportId(ctx),
        'dir': ctx.dir,
        'tabIndex': 0,
        'data-orientation': ctx.virtual?.orientation ?? 'vertical',
        'style': {
          overflow: 'scroll',
          width: '100%',
          height: '100%',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          // Hide scrollbar for Chrome, Safari, and Opera
          WebkitOverflowScrolling: 'touch',
        },
        onScroll(event) {
          const target = event.currentTarget
          send({
            type: 'SCROLL',
            scrollTop: target.scrollTop,
            scrollLeft: target.scrollLeft,
          })
          send('SCROLL_START')
        },
      })
    },

    getContentProps() {
      const isVirtual = ctx.isVirtual
      const totalSize = ctx.virtualState?.totalSize ?? 0
      const orientation = ctx.virtual?.orientation ?? 'vertical'

      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(ctx),
        'dir': ctx.dir,
        'data-orientation': orientation,
        'style': isVirtual
          ? {
              position: 'relative',
              width: orientation === 'horizontal' ? `${totalSize}px` : '100%',
              height: orientation === 'vertical' ? `${totalSize}px` : '100%',
            }
          : undefined,
      })
    },

    getScrollbarProps(options: ScrollbarProps) {
      const { orientation } = options
      const isVertical = orientation === 'vertical'
      const visible = isVertical ? scrollbarYVisible : scrollbarXVisible

      return normalize.element({
        ...parts.scrollbar.attrs,
        'id': isVertical ? dom.getScrollbarYId(ctx) : dom.getScrollbarXId(ctx),
        'dir': ctx.dir,
        'role': 'scrollbar',
        'aria-controls': dom.getViewportId(ctx),
        'aria-orientation': orientation,
        'aria-valuenow': isVertical ? ctx.scrollTop : ctx.scrollLeft,
        'aria-valuemin': 0,
        'aria-valuemax': isVertical
          ? ctx.contentHeight - ctx.viewportHeight
          : ctx.contentWidth - ctx.viewportWidth,
        'data-orientation': orientation,
        'data-state': visible ? 'visible' : 'hidden',
        'hidden': !visible,
        'style': {
          position: 'absolute',
          ...(isVertical
            ? {
                top: 0,
                right: ctx.isRtl ? undefined : 0,
                left: ctx.isRtl ? 0 : undefined,
                bottom: scrollbarXVisible ? '10px' : 0,
                width: '10px',
              }
            : {
                bottom: 0,
                left: ctx.isRtl ? (scrollbarYVisible ? '10px' : 0) : 0,
                right: ctx.isRtl ? 0 : (scrollbarYVisible ? '10px' : 0),
                height: '10px',
              }),
          userSelect: 'none',
          touchAction: 'none',
        },
        onPointerDown(event) {
          // Click on track to scroll
          if (event.target === event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect()
            const clickPosition = isVertical
              ? (event.clientY - rect.top) / rect.height
              : (event.clientX - rect.left) / rect.width

            const maxScroll = isVertical
              ? ctx.contentHeight - ctx.viewportHeight
              : ctx.contentWidth - ctx.viewportWidth

            send({
              type: 'SCROLL_TO',
              [isVertical ? 'top' : 'left']: clickPosition * maxScroll,
              behavior: 'auto',
            })
          }
        },
      })
    },

    getThumbProps(options: ScrollbarProps) {
      const { orientation } = options
      const isVertical = orientation === 'vertical'
      const thumbSize = isVertical ? ctx.thumbYSize : ctx.thumbXSize
      const thumbPosition = isVertical ? ctx.thumbYPosition : ctx.thumbXPosition
      const visible = isVertical ? scrollbarYVisible : scrollbarXVisible

      return normalize.element({
        ...parts.thumb.attrs,
        'id': isVertical ? dom.getThumbYId(ctx) : dom.getThumbXId(ctx),
        'dir': ctx.dir,
        'data-orientation': orientation,
        'data-state': visible ? 'visible' : 'hidden',
        'data-dragging': dataAttr(ctx.isDragging && ctx.draggingAxis === orientation),
        'style': {
          position: 'absolute',
          borderRadius: '9999px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          ...(isVertical
            ? {
                width: '100%',
                height: `${thumbSize}%`,
                top: `${thumbPosition}%`,
              }
            : {
                height: '100%',
                width: `${thumbSize}%`,
                left: `${thumbPosition}%`,
              }),
          cursor: 'pointer',
          userSelect: 'none',
          touchAction: 'none',
        },
        onPointerDown(event) {
          event.preventDefault()
          event.stopPropagation()

          // Set pointer capture
          event.currentTarget.setPointerCapture(event.pointerId)

          send({
            type: 'THUMB_POINTER_DOWN',
            orientation,
            clientX: event.clientX,
            clientY: event.clientY,
          })

          // Add global event listeners
          const onPointerMove = (e: PointerEvent) => {
            send({
              type: 'POINTER_MOVE',
              clientX: e.clientX,
              clientY: e.clientY,
            })
          }

          const onPointerUp = () => {
            send('POINTER_UP')
            document.removeEventListener('pointermove', onPointerMove)
            document.removeEventListener('pointerup', onPointerUp)
          }

          document.addEventListener('pointermove', onPointerMove)
          document.addEventListener('pointerup', onPointerUp)
        },
      })
    },

    getCornerProps() {
      const visible = scrollbarXVisible && scrollbarYVisible

      return normalize.element({
        ...parts.corner.attrs,
        'id': dom.getCornerId(ctx),
        'dir': ctx.dir,
        'data-state': visible ? 'visible' : 'hidden',
        'hidden': !visible,
        'style': {
          position: 'absolute',
          bottom: 0,
          right: ctx.isRtl ? undefined : 0,
          left: ctx.isRtl ? 0 : undefined,
          width: '10px',
          height: '10px',
        },
      })
    },
  }
}
