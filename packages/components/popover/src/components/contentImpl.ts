import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, withDirectives } from 'vue'
import { useFocusGuards, useForwardProps } from '@destyler/composition'
import { DestylerPopperContent } from '@destyler/popper'
import { DestylerDismissableLayer } from '@destyler/dismissable-layer'
import type { AsTag } from '@destyler/primitive'
import { DestylerFocusScope } from '@destyler/focus-scope'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPopoverRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

type Side = (typeof SIDE_OPTIONS)[number]
type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerPopoverContentImplProps = {
  side: {
    type: String as PropType<Side>,
    required: false,
    default: 'bottom',
  },
  sideOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  align: {
    type: String as PropType<Align>,
    required: false,
    default: 'center',
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
  arrowPadding: {
    type: Number as PropType<number>,
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
  updatePositionStrategy: {
    type: String as PropType<'optimized' | 'always'>,
    required: false,
    default: 'optimized',
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
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerPopoverContentImplProps = ExtractPublicPropTypes<typeof destylerPopoverContentImplProps>

export const destylerPopoverContentImplEmits = ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'openAutoFocus', 'closeAutoFocus']

export const DestylerPopoverContentImpl = defineComponent({
  name: 'DestylerPopoverContentImpl',
  props: destylerPopoverContentImplProps,
  emits: destylerPopoverContentImplEmits,
  setup(props) {
    const forwarded = useForwardProps(props)
    const rootContext = injectPopoverRootContext()
    useFocusGuards()

    return {
      rootContext,
      forwarded,
    }
  },
  render() {
    return h(DestylerFocusScope, {
      asChild: true,
      loop: true,
      trapped: this.$props.trapFocus,
      onMountAutoFocus: (event) => {
        this.$emit('openAutoFocus', event)
      },
      onUnmountAutoFocus: (event) => {
        this.$emit('closeAutoFocus', event)
      },
    }, () => h(DestylerDismissableLayer, {
      asChild: true,
      disableOutsidePointerEvents: this.$props.disableOutsidePointerEvents,
      onPointerDownOutside: (event) => {
        this.$emit('pointerDownOutside', event)
      },
      onInteractOutside: (event) => {
        this.$emit('interactOutside', event)
      },
      onEscapeKeyDown: (event) => {
        this.$emit('escapeKeyDown', event)
      },
      onFocusOutside: (event) => {
        this.$emit('focusOutside', event)
      },
      onDismiss: () => {
        this.rootContext.onOpenChange(false)
      },
    }, withDirectives(h(DestylerPopperContent, mergeProps(this.forwarded, {
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'role': 'dialog',
      'style': {
        '--destyler_popover_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_popover_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_popover_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_popover_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_popover_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ])))
  },
})
