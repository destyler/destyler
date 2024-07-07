import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, nextTick, onMounted, onUnmounted, ref, watchEffect, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardProps } from '@destyler/composition'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { dismissableLayerEmits } from '@destyler/dismissable-layer/dist/component'
import { PopperContent, popperContentProps } from '@destyler/popper'

import { getTabbableNodes } from '../utils'
import { injectHoverCardRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const hoverCardContentImplProps = {
  ...popperContentProps,
} as const

export type HoverCardContentImplProps = ExtractPublicPropTypes<typeof hoverCardContentImplProps>

export const hoverCardContentImplEmits = {
  ...dismissableLayerEmits,
}

export const HoverCardContentImpl = defineComponent({
  name: 'DestylerHoverCardContentImpl',
  props: hoverCardContentImplProps,
  emits: hoverCardContentImplEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
    return h(DismissableLayer, {
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
    }, () => h(PopperContent, mergeProps(this.forwarded, this.$attrs, {
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
