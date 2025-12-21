import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { raf, trackPointerMove } from '@destyler/dom'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'
import { dom } from './dom'
import { clamp, getHandleBounds, getHandlePanels, getNormalizedPanels, getPanelBounds } from './utils'

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  return createMachine<MachineContext, MachineState>(
    {
      id: 'splitter',
      initial: 'idle',
      context: {
        orientation: 'horizontal',
        activeResizeId: null,
        previousPanels: [],
        size: [],
        initialSize: [],
        activeResizeState: {
          isAtMin: false,
          isAtMax: false,
        },
        initialDragPoint: null,
        initialDragSizes: null,
        ...ctx,
      },

      created: ['setPreviousPanels', 'setInitialSize'],

      watch: {
        size: ['setActiveResizeState'],
      },

      computed: {
        isHorizontal: ctx => ctx.orientation === 'horizontal',
        panels: ctx => getNormalizedPanels(ctx),
      },

      on: {
        SET_PANEL_SIZE: {
          actions: 'setPanelSize',
        },
      },
      states: {
        'idle': {
          entry: ['clearActiveHandleId'],
          on: {
            POINTER_OVER: {
              target: 'hover:temp',
              actions: ['setActiveHandleId'],
            },
            FOCUS: {
              target: 'focused',
              actions: ['setActiveHandleId'],
            },
            DOUBLE_CLICK: {
              actions: ['resetStartPanel', 'setPreviousPanels'],
            },
          },
        },

        'hover:temp': {
          after: {
            HOVER_DELAY: 'hover',
          },
          on: {
            POINTER_DOWN: {
              target: 'dragging',
              actions: ['setActiveHandleId'],
            },
            POINTER_LEAVE: 'idle',
          },
        },

        'hover': {
          tags: ['focus'],
          on: {
            POINTER_DOWN: 'dragging',
            POINTER_LEAVE: 'idle',
          },
        },

        'focused': {
          tags: ['focus'],
          on: {
            BLUR: 'idle',
            POINTER_DOWN: {
              target: 'dragging',
              actions: ['setActiveHandleId'],
            },
            ARROW_LEFT: {
              guard: 'isHorizontal',
              actions: ['shrinkStartPanel', 'setPreviousPanels'],
            },
            ARROW_RIGHT: {
              guard: 'isHorizontal',
              actions: ['expandStartPanel', 'setPreviousPanels'],
            },
            ARROW_UP: {
              guard: 'isVertical',
              actions: ['shrinkStartPanel', 'setPreviousPanels'],
            },
            ARROW_DOWN: {
              guard: 'isVertical',
              actions: ['expandStartPanel', 'setPreviousPanels'],
            },
            ENTER: [
              {
                guard: 'isStartPanelAtMax',
                actions: ['setStartPanelToMin', 'setPreviousPanels'],
              },
              { actions: ['setStartPanelToMax', 'setPreviousPanels'] },
            ],
            HOME: {
              actions: ['setStartPanelToMin', 'setPreviousPanels'],
            },
            END: {
              actions: ['setStartPanelToMax', 'setPreviousPanels'],
            },
          },
        },

        'dragging': {
          tags: ['focus'],
          entry: ['focusResizeHandle', 'storeInitialDragState'],
          activities: ['trackPointerMove'],
          on: {
            POINTER_MOVE: {
              actions: ['setPointerValue', 'setGlobalCursor', 'invokeOnResize'],
            },
            POINTER_UP: {
              target: 'focused',
              actions: ['setPreviousPanels', 'clearGlobalCursor', 'blurResizeHandle', 'invokeOnResizeEnd'],
            },
          },
        },
      },
    },
    {
      activities: {
        trackPointerMove: (ctx, _evt, { send }) => {
          const doc = dom.getDoc(ctx)
          return trackPointerMove(doc, {
            onPointerMove(info) {
              send({ type: 'POINTER_MOVE', point: info.point })
            },
            onPointerUp() {
              send('POINTER_UP')
            },
          })
        },
      },
      guards: {
        isStartPanelAtMin: ctx => ctx.activeResizeState.isAtMin,
        isStartPanelAtMax: ctx => ctx.activeResizeState.isAtMax,
        isHorizontal: ctx => ctx.isHorizontal,
        isVertical: ctx => !ctx.isHorizontal,
      },
      delays: {
        HOVER_DELAY: 250,
      },
      actions: {
        setGlobalCursor(ctx) {
          dom.setupGlobalCursor(ctx)
        },
        clearGlobalCursor(ctx) {
          dom.removeGlobalCursor(ctx)
        },
        invokeOnResize(ctx) {
          ctx.onSizeChange?.({ size: Array.from(ctx.size), activeHandleId: ctx.activeResizeId })
        },
        invokeOnResizeEnd(ctx) {
          ctx.onSizeChangeEnd?.({ size: Array.from(ctx.size), activeHandleId: ctx.activeResizeId })
        },
        setActiveHandleId(ctx, evt) {
          ctx.activeResizeId = evt.id
        },
        clearActiveHandleId(ctx) {
          ctx.activeResizeId = null
        },
        setInitialSize(ctx) {
          ctx.initialSize = ctx.panels.slice().map(panel => ({
            id: panel.id,
            size: panel.size,
          }))
        },
        setPanelSize(ctx, evt) {
          const { id, size } = evt
          ctx.size = ctx.size.map((panel) => {
            const panelSize = clamp(size, panel.minSize ?? 0, panel.maxSize ?? 100)
            return panel.id === id ? { ...panel, size: panelSize } : panel
          })
        },
        setStartPanelToMin(ctx) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          ctx.size[before.index].size = before.min
          ctx.size[after.index].size = after.min
        },
        setStartPanelToMax(ctx) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          ctx.size[before.index].size = before.max
          ctx.size[after.index].size = after.max
        },
        expandStartPanel(ctx, evt) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          ctx.size[before.index].size = before.up(evt.step)
          ctx.size[after.index].size = after.down(evt.step)
        },
        shrinkStartPanel(ctx, evt) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          ctx.size[before.index].size = before.down(evt.step)
          ctx.size[after.index].size = after.up(evt.step)
        },
        resetStartPanel(ctx, evt) {
          const bounds = getPanelBounds(ctx, evt.id)
          if (!bounds)
            return
          const { before, after } = bounds
          ctx.size[before.index].size = ctx.initialSize[before.index].size
          ctx.size[after.index].size = ctx.initialSize[after.index].size
        },
        focusResizeHandle(ctx) {
          raf(() => {
            dom.getActiveHandleEl(ctx)?.focus({ preventScroll: true })
          })
        },
        blurResizeHandle(ctx) {
          raf(() => {
            dom.getActiveHandleEl(ctx)?.blur()
          })
        },
        storeInitialDragState(ctx, evt) {
          const panels = getHandlePanels(ctx)
          if (!panels)
            return
          const { before, after } = panels
          ctx.initialDragPoint = evt.point
          ctx.initialDragSizes = {
            before: before.size,
            after: after.size,
          }
        },
        setPreviousPanels(ctx) {
          ctx.previousPanels = ctx.panels.slice()
        },
        setActiveResizeState(ctx) {
          const panels = getPanelBounds(ctx)
          if (!panels)
            return
          const { before } = panels
          ctx.activeResizeState = {
            isAtMin: before.isAtMin,
            isAtMax: before.isAtMax,
          }
        },
        setPointerValue(ctx, evt) {
          const panels = getHandlePanels(ctx)
          const bounds = getHandleBounds(ctx)

          if (!panels || !bounds)
            return

          const rootEl = dom.getRootEl(ctx)
          if (!rootEl)
            return

          if (!ctx.initialDragPoint || !ctx.initialDragSizes)
            return

          const { before, after } = panels

          // Calculate relative movement from initial drag position
          const rootSize = ctx.isHorizontal ? rootEl.offsetWidth : rootEl.offsetHeight
          const currentPos = ctx.isHorizontal ? evt.point.x : evt.point.y
          const initialPos = ctx.isHorizontal ? ctx.initialDragPoint.x : ctx.initialDragPoint.y

          // Handle RTL for horizontal orientation
          const isRtl = ctx.dir === 'rtl' && ctx.isHorizontal
          const deltaPixels = isRtl ? (initialPos - currentPos) : (currentPos - initialPos)
          const deltaPercent = (deltaPixels / rootSize) * 100

          // Calculate new sizes based on delta from initial sizes
          let newBeforeSize = ctx.initialDragSizes.before + deltaPercent
          let newAfterSize = ctx.initialDragSizes.after - deltaPercent

          // Update active resize state
          ctx.activeResizeState = {
            isAtMin: newBeforeSize <= before.minSize,
            isAtMax: newBeforeSize >= before.maxSize,
          }

          // Apply constraints
          newBeforeSize = clamp(newBeforeSize, before.minSize, before.maxSize)
          newAfterSize = clamp(newAfterSize, after.minSize, after.maxSize)

          // Ensure total doesn't exceed available space
          const totalSize = ctx.initialDragSizes.before + ctx.initialDragSizes.after
          if (newBeforeSize + newAfterSize > totalSize) {
            if (deltaPercent > 0) {
              newAfterSize = totalSize - newBeforeSize
            }
            else {
              newBeforeSize = totalSize - newAfterSize
            }
          }

          ctx.size[before.index].size = newBeforeSize
          ctx.size[after.index].size = newAfterSize
        },
      },
    },
  )
}
