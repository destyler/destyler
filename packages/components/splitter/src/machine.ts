import type { MachineContext, MachineState, PanelSizeData, UserDefinedContext } from './types'
import { raf, trackPointerMove } from '@destyler/dom'
import { compact, isControlledByFlag, isEqual, resolveControllableProp } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'
import { dom } from './dom'
import { clamp, getHandleBounds, getHandlePanels, getNormalizedPanels, getPanelBounds } from './utils'

function cloneSize(size: PanelSizeData[]): PanelSizeData[] {
  return size.map(panel => ({ ...panel }))
}

const invoke = {
  sizeChange(ctx: MachineContext, size: PanelSizeData[]) {
    ctx.onSizeChange?.({ size: cloneSize(size), activeHandleId: ctx.activeResizeId })
  },
  sizeChangeEnd(ctx: MachineContext) {
    ctx.onSizeChangeEnd?.({ size: cloneSize(ctx.size ?? []), activeHandleId: ctx.activeResizeId })
  },
}

const set = {
  size(ctx: MachineContext, value: PanelSizeData[]) {
    const next = cloneSize(value)
    if (isEqual(ctx.size, next))
      return
    // Dual-track: only defer context writes when size.controlled is set
    if (isControlledByFlag(ctx, 'size')) {
      invoke.sizeChange(ctx, next)
      return
    }
    ctx.size = next
    invoke.sizeChange(ctx, ctx.size)
  },
}

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  const { initial: initialSize } = resolveControllableProp({
    value: ctx.size,
    defaultValue: ctx.defaultSize,
    controlledFlag: ctx['size.controlled'],
    fallback: [] as PanelSizeData[],
  })
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
        // Resolve after spread so defaultSize / legacy size seed win consistently
        size: cloneSize(initialSize),
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
              actions: ['setPointerValue', 'setGlobalCursor'],
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
        invokeOnResizeEnd(ctx) {
          invoke.sizeChangeEnd(ctx)
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
          const next = cloneSize(ctx.size ?? [])
          const index = next.findIndex(panel => panel.id === id)
          if (index === -1)
            return
          const panel = next[index]
          const panelSize = clamp(size, panel.minSize ?? 0, panel.maxSize ?? 100)
          next[index] = { ...panel, size: panelSize }
          set.size(ctx, next)
        },
        setStartPanelToMin(ctx) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          const next = cloneSize(ctx.size ?? [])
          next[before.index] = { ...next[before.index], size: before.min }
          next[after.index] = { ...next[after.index], size: after.min }
          set.size(ctx, next)
        },
        setStartPanelToMax(ctx) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          const next = cloneSize(ctx.size ?? [])
          next[before.index] = { ...next[before.index], size: before.max }
          next[after.index] = { ...next[after.index], size: after.max }
          set.size(ctx, next)
        },
        expandStartPanel(ctx, evt) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          const next = cloneSize(ctx.size ?? [])
          next[before.index] = { ...next[before.index], size: before.up(evt.step) }
          next[after.index] = { ...next[after.index], size: after.down(evt.step) }
          set.size(ctx, next)
        },
        shrinkStartPanel(ctx, evt) {
          const bounds = getPanelBounds(ctx)
          if (!bounds)
            return
          const { before, after } = bounds
          const next = cloneSize(ctx.size ?? [])
          next[before.index] = { ...next[before.index], size: before.down(evt.step) }
          next[after.index] = { ...next[after.index], size: after.up(evt.step) }
          set.size(ctx, next)
        },
        resetStartPanel(ctx, evt) {
          const bounds = getPanelBounds(ctx, evt.id)
          if (!bounds)
            return
          const { before, after } = bounds
          const next = cloneSize(ctx.size ?? [])
          next[before.index] = { ...next[before.index], size: ctx.initialSize[before.index].size }
          next[after.index] = { ...next[after.index], size: ctx.initialSize[after.index].size }
          set.size(ctx, next)
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

          const next = cloneSize(ctx.size ?? [])
          next[before.index] = { ...next[before.index], size: newBeforeSize }
          next[after.index] = { ...next[after.index], size: newAfterSize }
          set.size(ctx, next)
        },
      },
    },
  )
}
