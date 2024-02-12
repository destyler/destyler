import type { Component, PropType } from 'vue'
import { defineComponent, h, ref, watch, watchEffect } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'
import { DestylerScrollSelectButtonImpl } from './scrollButtonImpl'
import { injectSelectItemAlignedPositionContext } from './itemAlignedPosition'

export const destylerSelectScrollDownButtonProps = {
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
} as const

export type DestylerSelectScrollDownButtonProps = ExtractPublicPropTypes<typeof destylerSelectScrollDownButtonProps>

export const DestylerSelectScrollDownButton = defineComponent({
  name: 'DestylerSelectScrollDownButton',
  props: destylerSelectScrollDownButtonProps,
  setup() {
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const alignedPositionContext
  = contentContext.position === 'item-aligned'
    ? injectSelectItemAlignedPositionContext()
    : undefined

    const { forwardRef, currentElement } = useForwardExpose()

    const canScrollDown = ref(false)

    watchEffect((cleanupFn) => {
      if (contentContext.viewport?.value && contentContext.isPositioned?.value) {
        const viewport = contentContext.viewport.value

        function handleScroll() {
          const maxScroll = viewport.scrollHeight - viewport.clientHeight
          // we use Math.ceil here because if the UI is zoomed-in
          // `scrollTop` is not always reported as an integer
          canScrollDown.value = Math.ceil(viewport.scrollTop) < maxScroll
        }
        handleScroll()
        viewport.addEventListener('scroll', handleScroll)

        cleanupFn(() => viewport.removeEventListener('scroll', handleScroll))
      }
    })

    watch(currentElement, () => {
      if (currentElement.value)
        alignedPositionContext?.onScrollButtonChange(currentElement.value)
    })

    return {
      canScrollDown,
      forwardRef,
      contentContext,
    }
  },
  render() {
    return this.canScrollDown
      ? h(DestylerScrollSelectButtonImpl, {
        ref: this.forwardRef,
        onAutoScroll: () => {
          const { viewport, selectedItem } = this.contentContext
          if (viewport?.value && selectedItem?.value)
            viewport.value.scrollTop = viewport.value.scrollTop + selectedItem.value.offsetHeight
        },
      }, {
        default: () => this.$slots.default?.(),
      })
      : null
  },
})
