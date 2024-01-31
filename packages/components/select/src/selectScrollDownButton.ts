import { defineComponent, h, ref, watch, watchEffect } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './selectContentImpl'
import { DestylerScrollSelectButtonImpl } from './selectScrollButtonImpl'
import { injectSelectItemAlignedPositionContext } from './selectItemAlignedPosition'

export const destylerSelectScrollDownButtonProps = {
  ...destylerPrimitiveProps,
}

export const DestylerSelectScrollDownButton = defineComponent({
  name: 'DestylerSelectScrollDownButton',
  props: destylerSelectScrollDownButtonProps,
  setup() {
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const alignedPositionContext
  = contentContext.position === 'item-aligned'
    ? injectSelectItemAlignedPositionContext()
    : undefined

    const { customElement, currentElement } = useCustomElement()

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
      customElement,
      contentContext,
    }
  },
  render() {
    return this.canScrollDown
      ? h(DestylerScrollSelectButtonImpl, {
        ref: 'customElement',
        onAutoScroll: () => {
          const { viewport, selectedItem } = this.contentContext
          if (viewport?.value && selectedItem?.value)
            viewport.value.scrollTop = viewport.value.scrollTop + selectedItem.value.offsetHeight
        },
      }, this.$slots.default?.())
      : null
  },
})
