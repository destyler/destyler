import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { CONTENT_MARGIN } from '../utils'
import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'
import { injectSelectItemAlignedPositionContext } from './itemAlignedPosition'

export const selectViewportProps = {
  ...primitiveProps,
  /**
   * Will add `nonce` attribute to the style tag which can be used by Content Security Policy.
   */
  nonce: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type SelectViewportProps = ExtractPublicPropTypes<typeof selectViewportProps>

export const SelectViewport = defineComponent({
  name: 'DestylerSelectViewport',
  props: selectViewportProps,
  setup() {
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const alignedPositionContext = contentContext.position === 'item-aligned'
      ? injectSelectItemAlignedPositionContext()
      : undefined

    const { forwardRef, currentElement } = useForwardExpose()

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
      forwardRef,
      handleScroll,
    }
  },
  render() {
    return [
      h(Primitive, mergeProps(
        {
          ...this.$props,
          ...this.$attrs,
        },
        {
          'ref': this.forwardRef,
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
        },
      ), () => this.$slots.default?.()),
      h(Primitive, {
        as: 'style',
        nonce: this.$props.nonce,
      }, () => `/* Hide scrollbars cross-browser and enable momentum scroll for touch
      devices */ [data-destyler-select-viewport] { scrollbar-width:none; -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch; }
      [data-destyler-select-viewport]::-webkit-scrollbar { display: none; }`),
    ]
  },
})
