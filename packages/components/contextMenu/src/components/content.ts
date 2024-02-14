import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, ref } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuContent } from '@destyler/menu'

import { injectContextMenuRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const

export type Side = (typeof SIDE_OPTIONS)[number]

export const destylerContextMenuContentProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  alignOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  avoidCollisions: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  collisionBoundary: {
    type: [Object, Array, null] as PropType<Element | null | Array<Element | null>>,
    required: false,
    default: () => [],
  },
  collisionPadding: {
    type: [Number, Object] as PropType<number | Partial<Record<Side, number>>>,
    required: false,
    default: 0,
  },
  sticky: {
    type: String as PropType<'partial' | 'always'>,
    required: false,
    default: 'partial',
  },
  hideWhenDetached: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  onPlaced: {
    type: Function as PropType<() => void>,
    required: false,
  },
  prioritizePosition: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  disableOutsideScroll: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
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
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
