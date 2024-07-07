import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, watch, watchEffect } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'
import { ScrollSelectButtonImpl } from './scrollButtonImpl'
import { injectSelectItemAlignedPositionContext } from './itemAlignedPosition'

export const selectScrollUpButtonProps = {
  ...primitiveProps,
} as const

export type SelectScrollUpButtonProps = ExtractPublicPropTypes<typeof selectScrollUpButtonProps>

export const SelectScrollUpButton = defineComponent({
  name: 'DestylerSelectScrollUpButton',
  props: selectScrollUpButtonProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const alignedPositionContext = contentContext.position === 'item-aligned'
      ? injectSelectItemAlignedPositionContext()
      : undefined

    const { forwardRef, currentElement } = useForwardExpose()

    const canScrollUp = ref(false)

    watchEffect((cleanupFn) => {
      if (contentContext.viewport?.value && contentContext.isPositioned?.value) {
        const viewport = contentContext.viewport.value

        function handleScroll() {
          canScrollUp.value = viewport.scrollTop > 0
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
      contentContext,
      forwardRef,
      canScrollUp,
    }
  },
  render() {
    return this.canScrollUp
      ? h(ScrollSelectButtonImpl, {
        ref: (el: any) => this.forwardRef(el),
        onAutoScroll: () => {
          const { viewport, selectedItem } = this.contentContext
          if (viewport?.value && selectedItem?.value)
            viewport.value.scrollTop = viewport.value.scrollTop - selectedItem.value.offsetHeight
        },
      }, () => this.$slots.default?.())
      : null
  },
})
