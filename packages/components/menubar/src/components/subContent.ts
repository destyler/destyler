import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useCollection, useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { wrapArray } from '@destyler/shared'
import { DestylerMenuSubContent } from '@destyler/menu'

import { injectMenubarRootContext } from './root'
import { injectMenubarMenuContext } from './menu'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerMenubarSubContentProps = {
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

export type DestylerMenubarSubContentProps = ExtractPublicPropTypes<typeof destylerMenubarSubContentProps>

export const DestylerMenubarSubContent = defineComponent({
  name: 'DestylerMenubarSubContent',
  props: destylerMenubarSubContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    const { injectCollection } = useCollection('menubar')

    const rootContext = injectMenubarRootContext()
    const menuContext = injectMenubarMenuContext()
    const collections = injectCollection()

    function handleArrowNavigation(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const targetIsSubTrigger = target.hasAttribute(
        'data-destyler-menubar-subtrigger',
      )

      if (targetIsSubTrigger)
        return

      let candidateValues = collections.value.map(i => i.dataset.value)

      const currentIndex = candidateValues.indexOf(menuContext.value)

      candidateValues = rootContext.loop.value
        ? wrapArray(candidateValues, currentIndex + 1)
        : candidateValues.slice(currentIndex + 1)

      const [nextValue] = candidateValues
      if (nextValue)
        rootContext.onMenuOpen(nextValue)
    }

    return {
      forwarded,
      handleArrowNavigation,
    }
  },
  render() {
    return h(DestylerMenuSubContent, mergeProps(this.forwarded, {
      'data-destyler-menubar-content': '',
      'style': {
        '--destyler_menubar_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_menubar_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_menubar_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_menubar_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_menubar_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
      'onKeydown': withModifiers((event: any) => {
        this.handleArrowNavigation(event)
      }, ['arrow-right']),
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
