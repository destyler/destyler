import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, nextTick, onMounted, onUnmounted, ref, watchEffect, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { useForwardExpose, useForwardProps } from '@destyler/composition'
import { DestylerDismissableLayer } from '@destyler/dismissable-layer'
import { DestylerPopperContent } from '@destyler/popper'

import { getTabbableNodes } from '../utils'
import { injectHoverCardRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerHoverCardContentImplProps = {
  ...destylerPrimitiveProps,
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
} as const

export type DestylerHoverCardContentImplProps = ExtractPublicPropTypes<typeof destylerHoverCardContentImplProps>

export const DestylerHoverCardContentImpl = defineComponent({
  name: 'DestylerHoverCardContentImpl',
  props: destylerHoverCardContentImplProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(props) {
    const forwarded = useForwardProps(props)

    const { forwardRef, currentElement: contentElement } = useForwardExpose()
    const rootContext = injectHoverCardRootContext()
    const containSelection = ref(false)

    let originalBodyUserSelect: string
    watchEffect((cleanupFn) => {
      if (containSelection.value) {
        const body = document.body

        originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect

        body.style.userSelect = 'none'
        body.style.webkitUserSelect = 'none'

        cleanupFn(() => {
          body.style.userSelect = originalBodyUserSelect
          body.style.webkitUserSelect = originalBodyUserSelect
        })
      }
    })

    function handlePointerUp() {
      containSelection.value = false
      rootContext.isPointerDownOnContentRef.value = false

      nextTick(() => {
        const hasSelection = document.getSelection()?.toString() !== ''
        if (hasSelection)
          rootContext.hasSelectionRef.value = true
      })
    }
    onMounted(() => {
      if (contentElement.value) {
        document.addEventListener('pointerup', handlePointerUp)

        const tabbables = getTabbableNodes(contentElement.value)
        tabbables.forEach(tabbable => tabbable.setAttribute('tabindex', '_1'))
      }
    })

    onUnmounted(() => {
      document.removeEventListener('pointerup', handlePointerUp)
      rootContext.hasSelectionRef.value = false
      rootContext.isPointerDownOnContentRef.value = false
    })
    return {
      rootContext,
      forwarded,
      forwardRef,
      containSelection,
    }
  },
  render() {
    return h(DestylerDismissableLayer, {
      asChild: true,
      disableOutsidePointerEvents: false,
      onEscapeKeyDown: (event: any) => {
        this.$emit('escapeKeyDown', event)
      },
      onPointerDownOutside: (event: any) => {
        this.$emit('pointerDownOutside', event)
      },
      onFocusOutside: withModifiers((event: any) => {
        this.$emit('focusOutside', event)
      }, ['prevent']),
      onDismiss: () => {
        this.rootContext.onDismiss()
      },
    }, () => h(DestylerPopperContent, mergeProps(this.forwarded, this.$attrs, {
      ref: (el: any) => this.forwardRef(el),
      data_state: this.rootContext.open.value ? 'open' : 'closed',
      style: {
        'userSelect': this.containSelection ? 'text' : undefined,
        'WebkitUserSelect': this.containSelection ? 'text' : undefined,
        '--destyler_hover_card_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_hover_card_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_hover_card_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_hover_card_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_hover_card_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
      onPointerdown: (event: any) => {
        if (event.currentTarget.contains(event.target as HTMLElement))
          this.containSelection = true

        this.rootContext.hasSelectionRef.value = false
        this.rootContext.isPointerDownOnContentRef.value = true
      },
    }), () => this.$slots.default?.()))
  },
})
