import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuSubContent } from '@destyler/menu'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerDropdownSubContentProps = {
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
  sideOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
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
    default: true,
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

export type DestylerDropdownSubContentProps = ExtractPublicPropTypes<typeof destylerDropdownSubContentProps>

export const DestylerDropdownSubContent = defineComponent({
  name: 'DestylerDropdownSubContent',
  props: destylerDropdownSubContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    return {
      forwarded,
    }
  },
  render() {
    return h(DestylerMenuSubContent, mergeProps(this.forwarded, {
      style: {
        '--destyler_dropdown_menu_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_dropdown_menu_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_dropdown_menu_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_dropdown_menu_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_dropdown_menu_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
