import { type PropType, defineComponent, mergeProps } from 'vue'
import { h, onMounted, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useDebounceFn, useForwardExpose, useResizeObserver } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarContext } from './scrollbar'
import { DestylerScrollAreaScrollbarVisible } from './scrollbarVisible'

export const destylerScrollAreaScrollbarAutoProps = {
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerScrollAreaScrollbarAutoProps = ExtractPublicPropTypes<typeof destylerScrollAreaScrollbarAutoProps>

export const DestylerScrollAreaScrollbarAuto = defineComponent({
  name: 'DestylerScrollAreaScrollbarAuto',
  props: destylerScrollAreaScrollbarAutoProps,
  setup() {
    const rootContext = injectScrollAreaRootContext()
    const scrollbarContext = injectScrollAreaScrollbarContext()

    const { forwardRef } = useForwardExpose()

    const visible = ref(false)

    const handleResize = useDebounceFn(() => {
      if (rootContext.viewport.value) {
        const isOverflowX
      = rootContext.viewport.value.offsetWidth
      < rootContext.viewport.value.scrollWidth
        const isOverflowY
      = rootContext.viewport.value.offsetHeight
      < rootContext.viewport.value.scrollHeight

        visible.value = scrollbarContext.isHorizontal.value
          ? isOverflowX
          : isOverflowY
      }
    }, 10)

    onMounted(() => handleResize())

    useResizeObserver(rootContext.viewport, handleResize)
    useResizeObserver(rootContext.content, handleResize)

    return {
      forwardRef,
      visible,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.visible,
    }, {
      default: () => {
        return h(DestylerScrollAreaScrollbarVisible, mergeProps(this.$attrs, {
          'ref': (el: any) => this.forwardRef(el),
          'data-state': this.visible ? 'visible' : 'hidden',
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
