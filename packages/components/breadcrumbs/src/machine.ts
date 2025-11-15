import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'

export function machine(userContext: UserDefinedContext) {
  const ctx = compact({
    separator: '/',
    items: [],
    ...userContext,
  })

  return createMachine<MachineContext, MachineState>(
    {
      id: 'breadcrumbs',
      initial: 'idle',
      context: {
        ...ctx,
        hoveredId: null,
        focusedId: null,
      },
      states: {
        idle: {
          on: {
            'ITEM.POINTER_OVER': {
              target: 'hovered',
              actions: ['setHoveredId'],
            },
            'ITEM.FOCUS': {
              target: 'focused',
              actions: ['setFocusedId'],
            },
          },
        },
        hovered: {
          tags: ['hovered'],
          on: {
            'ITEM.POINTER_OVER': {
              actions: ['setHoveredId'],
            },
            'ITEM.POINTER_LEAVE': [
              {
                guard: 'hasFocusedItem',
                target: 'focused',
                actions: ['clearHoveredId'],
              },
              {
                target: 'idle',
                actions: ['clearHoveredId'],
              },
            ],
            'ITEM.FOCUS': {
              target: 'focused',
              actions: ['setFocusedId'],
            },
          },
        },
        focused: {
          tags: ['focused'],
          on: {
            'ITEM.FOCUS': {
              actions: ['setFocusedId'],
            },
            'ITEM.BLUR': [
              {
                guard: 'hasHoveredItem',
                target: 'hovered',
                actions: ['clearFocusedId'],
              },
              {
                target: 'idle',
                actions: ['clearFocusedId'],
              },
            ],
            'ITEM.POINTER_OVER': {
              actions: ['setHoveredId'],
            },
            'ITEM.POINTER_LEAVE': {
              actions: ['clearHoveredId'],
            },
          },
        },
      },
    },
    {
      guards: {
        hasFocusedItem(ctx) {
          return ctx.focusedId != null
        },
        hasHoveredItem(ctx) {
          return ctx.hoveredId != null
        },
      },
      actions: {
        setHoveredId(ctx, evt) {
          ctx.hoveredId = evt.id
        },
        clearHoveredId(ctx) {
          ctx.hoveredId = null
        },
        setFocusedId(ctx, evt) {
          ctx.focusedId = evt.id
        },
        clearFocusedId(ctx) {
          ctx.focusedId = null
        },
      },
    },
  )
}
