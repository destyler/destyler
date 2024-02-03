import type { Component, PropType } from 'vue'
import { defineComponent, h, ref, watch, watchEffect } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'
import { DestylerScrollSelectButtonImpl } from './scrollButtonImpl'
import { injectSelectItemAlignedPositionContext } from './itemAlignedPosition'

export const destylerSelectScrollUpButtonProps = {
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

export type DestylerSelectScrollUpButtonProps = ExtractPublicPropTypes<typeof destylerSelectScrollUpButtonProps>

export const DestylerSelectScrollUpButton = defineComponent({
  name: 'DestylerSelectScrollUpButton',
  props: destylerSelectScrollUpButtonProps,
  setup() {
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const alignedPositionContext = contentContext.position === 'item-aligned'
      ? injectSelectItemAlignedPositionContext()
      : undefined

    const { customElement, currentElement } = useCustomElement()

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
      customElement,
      canScrollUp,
    }
  },
  render() {
    return this.canScrollUp
      ? h(DestylerScrollSelectButtonImpl, {
        ref: 'customElement',
        onAutoScroll: () => {
          const { viewport, selectedItem } = this.contentContext
          if (viewport?.value && selectedItem?.value)
            viewport.value.scrollTop = viewport.value.scrollTop - selectedItem.value.offsetHeight
        },
      }, {
        default: () => this.$slots.default?.(),
      })
      : null
  },
})
