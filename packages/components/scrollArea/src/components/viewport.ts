import { defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectScrollAreaRootContext } from './root'

export const destylerScrollAreaViewportProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerScrollAreaViewportProps = ExtractPublicPropTypes<typeof destylerScrollAreaViewportProps>

export const DestylerScrollAreaViewport = defineComponent({
  name: 'DestylerScrollAreaViewport',
  inheritAttrs: false,
  props: destylerScrollAreaViewportProps,
  setup() {
    const rootContext = injectScrollAreaRootContext()

    const viewportElement = ref<HTMLElement>()

    const { forwardRef, currentElement: contentElement } = useForwardExpose()

    onMounted(() => {
      rootContext.onViewportChange(viewportElement.value!)
      rootContext.onContentChange(contentElement.value!)
    })

    return {
      rootContext,
      viewportElement,
      forwardRef,
    }
  },
  render() {
    return [
      h('div', mergeProps(this.$attrs, {
        'ref': 'viewportElement',
        'data-destyler-scroll-area-viewport': '',
        'style': {
          overflowX: this.rootContext.scrollbarXEnabled.value ? 'scroll' : 'hidden',
          overflowY: this.rootContext.scrollbarYEnabled.value ? 'scroll' : 'hidden',
        },
        'tabindex': 0,
      }), h(DestylerPrimitive, {
        ref: (el: any) => this.forwardRef(el),
        as: this.$props.as,
        asChild: this.$props.asChild,
        style: {
          minWidth: '100%',
          display: 'table',
        },
      }, {
        default: () => this.$slots.default?.(),
      })),
      h(DestylerPrimitive, {
        as: 'style',
      }, {
        default: () => {
          return `
          /* Hide scrollbars cross-browser and enable momentum scroll for touch
          devices */
          [data-destyler-scroll-area-viewport] {
          scrollbar-width:none;
          -ms-overflow-style:none;
          -webkit-overflow-scrolling:touch;
          }

          [data-destyler-scroll-area-viewport]::-webkit-scrollbar {
          display:none;
          }
          `
        },
      }),
    ]
  },
})
