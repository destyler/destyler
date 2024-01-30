import { defineComponent, h, ref, watch, watchEffect } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './selectContentImpl'
import { DestylerScrollSelectButtonImpl } from './selectScrollButtonImpl'
import { injectSelectItemAlignedPositionContext } from './selectItemAlignedPosition'

export const destylerSelectScrollUpButtonProps = {
  ...destylerPrimitiveProps,
}

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
      }, this.$slots.default?.())
      : null
  },
})
