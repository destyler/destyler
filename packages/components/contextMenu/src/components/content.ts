import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { MenuContent, menuContentProps } from '@destyler/menu'
import { menuContentEmits } from '@destyler/menu/component'

import { injectContextMenuRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const

export type Side = (typeof SIDE_OPTIONS)[number]

export const contextMenuContentProps = {
  as: {
    ...menuContentProps.as,
  },
  asChild: {
    ...menuContentProps.asChild,
  },
  alignOffset: {
    ...menuContentProps.alignOffset,
    default: 0,
  },
  avoidCollisions: {
    ...menuContentProps.avoidCollisions,
    default: true,
  },
  collisionBoundary: {
    ...menuContentProps.collisionBoundary,
    default: () => [],
  },
  collisionPadding: {
    ...menuContentProps.collisionPadding,
    default: 0,
  },
  sticky: {
    ...menuContentProps.sticky,
    default: 'partial',
  },
  hideWhenDetached: {
    ...menuContentProps.hideWhenDetached,
    default: false,
  },
  prioritizePosition: {
    ...menuContentProps.prioritizePosition,
    default: false,
  },
  disableOutsidePointerEvents: {
    ...menuContentProps.disableOutsidePointerEvents,
  },
  disableOutsideScroll: {
    ...menuContentProps.disableOutsideScroll,
  },
  trapFocus: {
    ...menuContentProps.trapFocus,
  },
  loop: {
    ...menuContentProps.loop,
  },
  forceMount: {
    ...menuContentProps.forceMount,
  },
} as const

export type ContextMenuContentProps = ExtractPublicPropTypes<typeof contextMenuContentProps>

export const contextMenuContentEmits = {
  ...menuContentEmits,
}

export const ContextMenuContent = defineComponent({
  name: 'DestylerContextMenuContent',
  props: contextMenuContentProps,
  emits: contextMenuContentEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    useForwardExpose()
    const rootContext = injectContextMenuRootContext()
    const hasInteractedOutside = ref(false)

    return {
      forwarded,
      rootContext,
      hasInteractedOutside,
    }
  },
  render() {
    return h(MenuContent, mergeProps(this.forwarded, {
      side: 'right',
      sideOffset: 2,
      align: 'start',
      style: {
        '--destyler_context_menu_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_context_menu_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_context_menu_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_context_menu_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_context_menu_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
      onCloseAutoFocus: (event: any) => {
        if (!event.defaultPrevented && this.hasInteractedOutside)
          event.preventDefault()
        this.hasInteractedOutside = false
      },
      onInteractOutside: (event: any) => {
        if (!event.defaultPrevented && !this.rootContext.modal.value)
          this.hasInteractedOutside = true
      },
    }), () => this.$slots.default?.())
  },
})
