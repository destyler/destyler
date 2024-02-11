import type { Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, ref } from 'vue'
import type { Direction } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import type { Sizes } from '../types'
import { getScrollPositionFromPointer, getThumbOffsetFromScroll, getThumbRatio, isScrollingWithinScrollbarBounds } from '../utils'
import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarContext } from './scrollbar'
import { DestylerScrollAreaScrollbarX } from './scrollbarX'
import { DestylerScrollAreaScrollbarY } from './scrollbarY'

export interface ScrollAreaScrollbarVisibleContext {
  sizes: Ref<Sizes>
  hasThumb: Ref<boolean>
  handleWheelScroll: (event: WheelEvent, payload: number) => void
  handleThumbDown: (
    event: MouseEvent,
    payload: { x: number, y: number }
  ) => void
  handleThumbUp: (event: MouseEvent) => void
  handleSizeChange: (payload: Sizes) => void
  onThumbPositionChange: () => void
  onDragScroll: (payload: number) => void
  onThumbChange: (element: HTMLElement) => void
}

export const [injectScrollAreaScrollbarVisibleContext, provideScrollAreaScrollbarVisibleContext] = createContext<ScrollAreaScrollbarVisibleContext>('DestylerScrollAreaScrollbarVisible')

export const DestylerScrollAreaScrollbarVisible = defineComponent({
  name: 'DestylerScrollAreaScrollbarVisible',
  setup() {
    const rootContext = injectScrollAreaRootContext()
    const scrollbarContext = injectScrollAreaScrollbarContext()
    const { forwardRef } = useForwardExpose()

    const sizes = ref<Sizes>({
      content: 0,
      viewport: 0,
      scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
    })

    const hasThumb = computed(() => {
      const thumbRatio = getThumbRatio(sizes.value.viewport, sizes.value.content)
      return Boolean(thumbRatio > 0 && thumbRatio < 1)
    })

    const thumbRef = ref<HTMLElement>()
    const pointerOffset = ref(0)

    const isShowingScrollbarX = computed(() => scrollbarContext.isHorizontal.value)

    function handleWheelScroll(event: WheelEvent, payload: number) {
      if (isShowingScrollbarX.value) {
        const scrollPos = rootContext.viewport.value!.scrollLeft + event.deltaY

        rootContext.viewport.value!.scrollLeft = scrollPos
        // prevent window scroll when wheeling on scrollbar
        if (isScrollingWithinScrollbarBounds(scrollPos, payload))
          event.preventDefault()
      }
      else {
        const scrollPos = rootContext.viewport.value!.scrollTop + event.deltaY

        rootContext.viewport.value!.scrollTop = scrollPos
        // prevent window scroll when wheeling on scrollbar
        if (isScrollingWithinScrollbarBounds(scrollPos, payload))
          event.preventDefault()
      }
    }

    function handleThumbDown(event: MouseEvent, payload: { x: number, y: number }) {
      if (isShowingScrollbarX.value)
        pointerOffset.value = payload.x
      else pointerOffset.value = payload.y
    }
    function handleThumbUp() {
      pointerOffset.value = 0
    }

    function handleSizeChange(payload: Sizes) {
      sizes.value = payload
    }

    function getScrollPosition(pointerPos: number, dir?: Direction) {
      return getScrollPositionFromPointer(
        pointerPos,
        pointerOffset.value,
        sizes.value,
        dir,
      )
    }

    function onDragScroll(payload: number) {
      if (isShowingScrollbarX.value) {
        rootContext.viewport.value!.scrollLeft = getScrollPosition(
          payload,
          rootContext.dir.value,
        )
      }
      else {
        rootContext.viewport.value!.scrollTop = getScrollPosition(payload)
      }
    }

    function onThumbPositionChange() {
      if (isShowingScrollbarX.value) {
        if (rootContext.viewport.value && thumbRef.value) {
          const scrollPos = rootContext.viewport.value.scrollLeft
          const offset = getThumbOffsetFromScroll(
            scrollPos,
            sizes.value,
            rootContext.dir.value,
          )
          thumbRef.value.style.transform = `translate3d(${offset}px, 0, 0)`
        }
      }
      else {
        if (rootContext.viewport.value && thumbRef.value) {
          const scrollPos = rootContext.viewport.value.scrollTop
          const offset = getThumbOffsetFromScroll(scrollPos, sizes.value)
          thumbRef.value.style.transform = `translate3d(0, ${offset}px, 0)`
        }
      }
    }
    function onThumbChange(element: HTMLElement) {
      thumbRef.value = element
    }

    provideScrollAreaScrollbarVisibleContext({
      sizes,
      hasThumb,
      handleWheelScroll,
      handleThumbDown,
      handleThumbUp,
      handleSizeChange,
      onThumbPositionChange,
      onThumbChange,
      onDragScroll,
    })

    return {
      forwardRef,
      isShowingScrollbarX,
    }
  },
  render() {
    return this.isShowingScrollbarX
      ? h(DestylerScrollAreaScrollbarX, mergeProps(this.$props, {
        ref: 'forwardRef',
      }), {
        default: () => this.$slots.default?.(),
      })
      : h(DestylerScrollAreaScrollbarY, mergeProps(this.$props, {
        ref: 'forwardRef',
      }), {
        default: () => this.$slots.default?.(),
      })
  },
})
