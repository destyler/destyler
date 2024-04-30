import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, ref, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuAnchor } from '@destyler/menu'

import { isTouchOrPen } from '../utils'
import { injectContextMenuRootContext } from './root'

export interface Point {
  x: number
  y: number
}

export const destylerContextMenuTriggerPRops = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerContextMenuTriggerProps = ExtractPublicPropTypes<typeof destylerContextMenuTriggerPRops>

export const DestylerContextMenuTrigger = defineComponent({
  name: 'DestylerContextMenuTrigger',
  inheritAttrs: false,
  props: destylerContextMenuTriggerPRops,
  setup(props) {
    const { disabled } = toRefs(props)
    const { forwardRef } = useForwardExpose()
    const rootContext = injectContextMenuRootContext()
    const point = ref<Point>({ x: 0, y: 0 })
    const virtualEl = computed(() => ({
      getBoundingClientRect: () =>
        ({
          width: 0,
          height: 0,
          left: point.value.x,
          right: point.value.x,
          top: point.value.y,
          bottom: point.value.y,
          ...point.value,
        } as DOMRect),
    }))

    const longPressTimer = ref(0)
    function clearLongPress() {
      window.clearTimeout(longPressTimer.value)
    }

    function handleOpen(event: MouseEvent | PointerEvent) {
      point.value = { x: event.clientX, y: event.clientY }
      rootContext.onOpenChange(true)
    }

    async function handleContextMenu(event: PointerEvent) {
      if (!disabled.value) {
        await nextTick()
        if (!event.defaultPrevented) {
          clearLongPress()
          handleOpen(event)
          event.preventDefault()
        }
      }
    }

    async function handlePointerDown(event: PointerEvent) {
      if (!disabled.value) {
        await nextTick()

        if (isTouchOrPen(event) && !event.defaultPrevented) {
          // clear the long press here in case there's multiple touch points
          clearLongPress()
          longPressTimer.value = window.setTimeout(() => handleOpen(event), 700)
        }
      }
    }

    async function handlePointerEvent(event: PointerEvent) {
      if (!disabled.value) {
        await nextTick()
        if (isTouchOrPen(event) && !event.defaultPrevented)
          clearLongPress()
      }
    }

    return {
      virtualEl,
      forwardRef,
      rootContext,
      disabled,
      handleContextMenu,
      handlePointerDown,
      handlePointerEvent,
    }
  },
  render() {
    return [
      h(DestylerMenuAnchor, {
        as: 'template',
        element: this.virtualEl,
      }),
      h(DestylerPrimitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'as': this.$props.as,
        'asChild': this.$props.asChild,
        'data-state': this.rootContext.open.value ? 'open' : 'closed',
        'data-disabled': this.disabled ? '' : undefined,
        'style': {
          WebkitTouchCallout: 'none',
        },
        'onContextmenu': (event: any) => {
          this.handleContextMenu(event)
        },
        'onPointerdown': (event: any) => {
          this.handlePointerDown(event)
        },
        'onPointermove': (event: any) => {
          this.handlePointerEvent(event)
        },
        'onPointercancel': (event: any) => {
          this.handlePointerEvent(event)
        },
        'onPointerup': (event: any) => {
          this.handlePointerEvent(event)
        },
      }), () => this.$slots.default?.()),
    ]
  },
})
