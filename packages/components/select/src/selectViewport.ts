import { defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './selectContentImpl'
import { CONTENT_MARGIN } from './utils'
import { injectSelectItemAlignedPositionContext } from './selectItemAlignedPosition'

export const destylerSelectViewportProps = {
  ...destylerPrimitiveProps,
}

export const DestylerSelectViewport = defineComponent({
  name: 'DestylerSelectViewport',
  props: destylerSelectViewportProps,
  setup() {
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const alignedPositionContext = contentContext.position === 'item-aligned'
      ? injectSelectItemAlignedPositionContext()
      : undefined

    const { customElement, currentElement } = useCustomElement()

    onMounted(() => {
      contentContext?.onViewportChange(currentElement.value)
    })

    const prevScrollTopRef = ref(0)

    function handleScroll(event: WheelEvent) {
      const viewport = event.currentTarget as HTMLElement
      const { shouldExpandOnScrollRef, contentWrapper } = alignedPositionContext ?? {}
      if (shouldExpandOnScrollRef?.value && contentWrapper?.value) {
        const scrolledBy = Math.abs(prevScrollTopRef.value - viewport.scrollTop)
        if (scrolledBy > 0) {
          const availableHeight = window.innerHeight - CONTENT_MARGIN * 2
          const cssMinHeight = Number.parseFloat(
            contentWrapper.value.style.minHeight,
          )
          const cssHeight = Number.parseFloat(contentWrapper.value.style.height)
          const prevHeight = Math.max(cssMinHeight, cssHeight)

          if (prevHeight < availableHeight) {
            const nextHeight = prevHeight + scrolledBy
            const clampedNextHeight = Math.min(availableHeight, nextHeight)
            const heightDiff = nextHeight - clampedNextHeight

            contentWrapper.value.style.height = `${clampedNextHeight}px`
            if (contentWrapper.value.style.bottom === '0px') {
              viewport.scrollTop = heightDiff > 0 ? heightDiff : 0
              // ensure the content stays pinned to the bottom
              contentWrapper.value.style.justifyContent = 'flex-end'
            }
          }
        }
      }
      prevScrollTopRef.value = viewport.scrollTop
    }

    return {
      customElement,
      handleScroll,
    }
  },
  render() {
    return [
      h(DestylerPrimitive, mergeProps(this.$props, this.$attrs, {
        'ref': 'customElement',
        'data-destyler-select-viewport': '',
        'role': 'presentation',
        'style': {
          position: 'relative',
          flex: 1,
          overflow: 'auto',
        },
        'onScroll': (event: any) => {
          this.handleScroll(event)
        },
      }), this.$slots.default?.()),
      h(DestylerPrimitive, {
        as: 'style',
      }, `/* Hide scrollbars cross-browser and enable momentum scroll for touch
      devices */ [data-destyler-select-viewport] { scrollbar-width:none; -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch; }
      [data-destyler-select-viewport]::-webkit-scrollbar { display: none; }`),
    ]
  },
})
