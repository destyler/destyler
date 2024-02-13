import { type PropType, defineComponent, h, onMounted, onUnmounted, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useResizeObserver } from '@destyler/composition'
import { DestylerPrimitive } from '@destyler/primitive'

import { toInt } from '../utils'
import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarVisibleContext } from './scrollbarVisible'
import { injectScrollAreaScrollbarContext } from './scrollbar'

export const destylerScrollAreaScrollbarImplProps = {
  isHorizontal: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
} as const

export type DestylerScrollAreaScrollbarImplProps = ExtractPublicPropTypes<typeof destylerScrollAreaScrollbarImplProps>

export const DestylerScrollAreaScrollbarImpl = defineComponent({
  name: 'DestylerScrollAreaScrollbarImpl',
  props: destylerScrollAreaScrollbarImplProps,
  emits: ['onDragScroll', 'onWheelScroll', 'onThumbPointerDown'],
  setup(props, { emit }) {
    const rootContext = injectScrollAreaRootContext()
    const scrollbarVisibleContext = injectScrollAreaScrollbarVisibleContext()
    const scrollbarContext = injectScrollAreaScrollbarContext()

    const { forwardRef, currentElement: scrollbar } = useForwardExpose()
    const prevWebkitUserSelectRef = ref('')
    const rectRef = ref<DOMRect>()

    function handleDragScroll(event: MouseEvent) {
      if (rectRef.value) {
        const x = event.clientX - rectRef.value?.left
        const y = event.clientY - rectRef.value?.top
        emit('onDragScroll', { x, y })
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const mainPointer = 0
      if (event.button === mainPointer) {
        const element = event.target as HTMLElement
        element.setPointerCapture(event.pointerId)
        rectRef.value = scrollbar.value!.getBoundingClientRect()

        prevWebkitUserSelectRef.value = document.body.style.webkitUserSelect
        document.body.style.webkitUserSelect = 'none'
        if (rootContext.viewport)
          rootContext.viewport.value!.style.scrollBehavior = 'auto'

        handleDragScroll(event)
      }
    }

    function handlePointerMove(event: PointerEvent) {
      handleDragScroll(event)
    }

    function handlePointerUp(event: PointerEvent) {
      const element = event.target as HTMLElement
      if (element.hasPointerCapture(event.pointerId))
        element.releasePointerCapture(event.pointerId)

      document.body.style.webkitUserSelect = prevWebkitUserSelectRef.value
      if (rootContext.viewport)
        rootContext.viewport.value!.style.scrollBehavior = ''

      rectRef.value = undefined
    }

    function handleWheel(event: WheelEvent) {
      const element = event.target as HTMLElement
      const isScrollbarWheel = scrollbar.value?.contains(element)
      const maxScrollPos = scrollbarVisibleContext.sizes.value.content - scrollbarVisibleContext.sizes.value.viewport
      if (isScrollbarWheel)
        scrollbarVisibleContext.handleWheelScroll(event, maxScrollPos)
    }

    onMounted(() => {
      document.addEventListener('wheel', handleWheel, { passive: false })
    })
    onUnmounted(() => {
      document.removeEventListener('wheel', handleWheel)
    })

    function handleSizeChange() {
      if (!scrollbar.value)
        return
      if (props.isHorizontal) {
        scrollbarVisibleContext.handleSizeChange({
          content: rootContext.viewport.value?.scrollWidth ?? 0,
          viewport: rootContext.viewport.value?.offsetWidth ?? 0,
          scrollbar: {
            size: scrollbar.value.clientWidth ?? 0,
            paddingStart: toInt(getComputedStyle(scrollbar.value).paddingLeft),
            paddingEnd: toInt(getComputedStyle(scrollbar.value).paddingRight),
          },
        })
      }
      else {
        scrollbarVisibleContext.handleSizeChange({
          content: rootContext.viewport.value?.scrollHeight ?? 0,
          viewport: rootContext.viewport.value?.offsetHeight ?? 0,
          scrollbar: {
            size: scrollbar.value?.clientHeight ?? 0,
            paddingStart: toInt(getComputedStyle(scrollbar.value!).paddingLeft),
            paddingEnd: toInt(getComputedStyle(scrollbar.value!).paddingRight),
          },
        })
      }
    }

    useResizeObserver(scrollbar, handleSizeChange)
    useResizeObserver(rootContext.content, handleSizeChange)

    return {
      forwardRef,
      scrollbarContext,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'style': {
        position: 'absolute',
      },
      'data-scrollbarimpl': '',
      'as': this.scrollbarContext.as.value,
      'asChild': this.scrollbarContext.asChild.value,
      'onPointerdown': (event: any) => {
        this.handlePointerDown(event)
      },
      'onPointermove': (event: any) => {
        this.handlePointerMove(event)
      },
      'onPointerup': (event: any) => {
        this.handlePointerUp(event)
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
