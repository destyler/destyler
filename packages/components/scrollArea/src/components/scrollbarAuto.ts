import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import {
  useDebounceFn,
  useForwardExpose,
  useResizeObserver,
} from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarContext } from './scrollbar'
import { ScrollAreaScrollbarVisible } from './scrollbarVisible'

export const scrollAreaScrollbarAutoProps = {
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ScrollAreaScrollbarAutoProps = ExtractPublicPropTypes<
  typeof scrollAreaScrollbarAutoProps
>

export const ScrollAreaScrollbarAuto = defineComponent({
  name: 'DestylerScrollAreaScrollbarAuto',
  props: scrollAreaScrollbarAutoProps,

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
    return h(
      Presence,
      {
        present: this.$props.forceMount || this.visible,
      },
      {
        default: () => {
          return h(
            ScrollAreaScrollbarVisible,
            mergeProps(this.$attrs, {
              'ref': (el: any) => this.forwardRef(el),
              'data-state': this.visible ? 'visible' : 'hidden',
            }),
            {
              default: () => this.$slots.default?.(),
            },
          )
        },
      },
    )
  },
})
