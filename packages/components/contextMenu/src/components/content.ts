import { defineComponent, h, mergeProps, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuContent, destylerMenuContentProps } from '@destyler/menu'

import { injectContextMenuRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const

export type Side = (typeof SIDE_OPTIONS)[number]

export const destylerContextMenuContentProps = {
  as: {
    ...destylerMenuContentProps.as,
  },
  asChild: {
    ...destylerMenuContentProps.asChild,
  },
  alignOffset: {
    ...destylerMenuContentProps.alignOffset,
    default: 0,
  },
  avoidCollisions: {
    ...destylerMenuContentProps.avoidCollisions,
    default: true,
  },
  collisionBoundary: {
    ...destylerMenuContentProps.collisionBoundary,
    default: () => [],
  },
  collisionPadding: {
    ...destylerMenuContentProps.collisionPadding,
    default: 0,
  },
  sticky: {
    ...destylerMenuContentProps.sticky,
    default: 'partial',
  },
  hideWhenDetached: {
    ...destylerMenuContentProps.hideWhenDetached,
    default: false,
  },
  onPlaced: {
    ...destylerMenuContentProps.onPlaced,
  },
  prioritizePosition: {
    ...destylerMenuContentProps.prioritizePosition,
    default: false,
  },
  disableOutsidePointerEvents: {
    ...destylerMenuContentProps.disableOutsidePointerEvents,
  },
  disableOutsideScroll: {
    ...destylerMenuContentProps.disableOutsideScroll,
  },
  trapFocus: {
    ...destylerMenuContentProps.trapFocus,
  },
  loop: {
    ...destylerMenuContentProps.loop,
  },
  forceMount: {
    ...destylerMenuContentProps.forceMount,
  },
} as const

export type DestylerContextMenuContentProps = ExtractPublicPropTypes<typeof destylerContextMenuContentProps>

export const DestylerContextMenuContent = defineComponent({
  name: 'DestylerContextMenuContent',
  props: destylerContextMenuContentProps,
  emits: ['update:checked', 'select'],
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
    return h(DestylerMenuContent, mergeProps(this.forwarded, {
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
