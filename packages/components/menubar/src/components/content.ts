import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, ref, withDirectives, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useCollection, useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { wrapArray } from '@destyler/shared'
import { DestylerMenuContent } from '@destyler/menu'
import { BindOnceDirective } from '@destyler/directives'

import { injectMenubarRootContext } from './root'
import { injectMenubarMenuContext } from './menu'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerMenubarContentProps = {
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

export type DestylerMenubarContentProps = ExtractPublicPropTypes<typeof destylerMenubarContentProps>

export const DestylerMenubarContent = defineComponent({
  name: 'DestylerMenubarContent',
  props: destylerMenubarContentProps,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    const rootContext = injectMenubarRootContext()
    const menuContext = injectMenubarMenuContext()

    const { injectCollection } = useCollection('menubar')
    const collections = injectCollection()

    const hasInteractedOutsideRef = ref(false)

    function handleArrowNavigation(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const targetIsSubTrigger = target.hasAttribute(
        'data-radix-menubar-subtrigger',
      )

      const prevMenuKey = rootContext.dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      const isPrevKey = prevMenuKey === event.key
      const isNextKey = !isPrevKey

      // Prevent navigation when we're opening a submenu
      if (isNextKey && targetIsSubTrigger)
        return

      let candidateValues = collections.value.map(i => i.dataset.value)
      if (isPrevKey)
        candidateValues.reverse()

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
      rootContext,
      menuContext,
      collections,
      hasInteractedOutsideRef,
      handleArrowNavigation,
    }
  },
  render() {
    return withDirectives(h(DestylerMenuContent, mergeProps(this.forwarded, {
      'aria-labelledby': this.menuContext.triggerId,
      'data-destyler-menubar-content': '',
      'style': {
        '--destyler_menubar_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_menubar_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_menubar_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_menubar_trigger_width': 'var(--radix_popper_anchor_width)',
        '--destyler_menubar_trigger_height': 'var(--radix_popper_anchor_height)',
      },
      'onCloseAutoFocus': (event: any) => {
        const menubarOpen = Boolean(this.rootContext.modelValue.value)
        if (!menubarOpen && !this.hasInteractedOutsideRef)
          this.menuContext.triggerElement.value?.focus()
        this.hasInteractedOutsideRef = false
        event.preventDefault()
      },
      'onFocusOutside': (event: any) => {
        const target = event.target as HTMLElement
        const isMenubarTrigger = this.collections.some(item => item.contains(target))
        if (isMenubarTrigger)
          event.preventDefault()
      },
      'onInteractOutside': () => {
        this.hasInteractedOutsideRef = true
      },
      'onEntryFocus': (event: any) => {
        if (!this.menuContext.wasKeyboardTriggerOpenRef.value)
          event.preventDefault()
      },
      'onKeydown': withModifiers((event: any) => {
        this.handleArrowNavigation(event)
      }, ['arrow-right', 'arrow-left']),
    }), {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.menuContext.contentId }],
    ])
  },
})
