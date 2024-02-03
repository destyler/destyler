import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPopperContent } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardProps } from '@destyler/composition'

import { CONTENT_MARGIN } from '../utils'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerSelectPopperPositionProps = {
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
    default: 'start',
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
    default: CONTENT_MARGIN,
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
} as const

export type DestylerSelectPopperPositionProps = ExtractPublicPropTypes<typeof destylerSelectPopperPositionProps>

export const DestylerSelectPopperPosition = defineComponent({
  name: 'DestylerSelectPopperPosition',
  props: destylerSelectPopperPositionProps,
  setup(props) {
    const forwarded = useForwardProps(props)
    return {
      forwarded,
    }
  },
  render() {
    return h(DestylerPopperContent, mergeProps(this.forwarded, {
      style: {
        'boxSizing': 'border_box',
        '--destyler_select_content_transform_origin':
        'var(--destyler_popper_transform_origin)',
        '--destyler_select_content_available_width':
        'var(--destyler_popper_available_width)',
        '--destyler_select_content_available_height':
        'var(--destyler_popper_available_height)',
        '--destyler_select_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_select_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
