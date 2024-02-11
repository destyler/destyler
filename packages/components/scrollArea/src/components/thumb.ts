import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, onUnmounted, ref } from 'vue'
import { watchOnce } from '@destyler/shared'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'

import { addUnlinkedScrollListener } from '../utils'
import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarVisibleContext } from './scrollbarVisible'

export const destylerScrollAreaThumbProps = {
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

export type DestylerScrollAreaThumbProps = ExtractPublicPropTypes<typeof destylerScrollAreaThumbProps>

export const DestylerScrollAreaThumb = defineComponent({
  name: 'DestylerScrollAreaThumb',
  props: destylerScrollAreaThumbProps,
  setup() {
    const rootContext = injectScrollAreaRootContext()
    const scrollbarContextVisible = injectScrollAreaScrollbarVisibleContext()

    function handlePointerDown(event: MouseEvent) {
      const thumb = event.target as HTMLElement
      const thumbRect = thumb.getBoundingClientRect()
      const x = event.clientX - thumbRect.left
      const y = event.clientY - thumbRect.top
      scrollbarContextVisible.handleThumbDown(event, { x, y })
    }

    function handlePointerUp(event: MouseEvent) {
      scrollbarContextVisible.handleThumbUp(event)
    }

    const { forwardRef, currentElement: thumbElement } = useForwardExpose()
    const removeUnlinkedScrollListenerRef = ref<() => void>()
    const viewport = computed(() => rootContext.viewport.value)

    function handleScroll() {
      if (!removeUnlinkedScrollListenerRef.value) {
        const listener = addUnlinkedScrollListener(
          viewport.value!,
          scrollbarContextVisible.onThumbPositionChange,
        )
        removeUnlinkedScrollListenerRef.value = listener
        scrollbarContextVisible.onThumbPositionChange()
      }
    }

    const sizes = computed(() => scrollbarContextVisible.sizes.value)

    watchOnce(sizes, () => {
      scrollbarContextVisible.onThumbChange(thumbElement.value!)
      if (viewport.value) {
        scrollbarContextVisible.onThumbPositionChange()
        viewport.value.addEventListener('scroll', handleScroll)
      }
    })

    onUnmounted(() => {
      viewport.value!.removeEventListener('scroll', handleScroll)
      rootContext.viewport.value?.removeEventListener('scroll', handleScroll)
    })

    return {
      forwardRef,
      scrollbarContextVisible,
      handlePointerDown,
      handlePointerUp,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'ref': 'forwardRef',
      'data-state': this.scrollbarContextVisible.hasThumb ? 'visible' : 'hidden',
      'style': {
        width: 'var(--destyler_scroll_area_thumb_width)',
        height: 'var(--destyler_scroll_area_thumb_height)',
      },
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'onPointerdown': (event: any) => {
        this.handlePointerDown(event)
      },
      'onPointerup': (event: any) => {
        this.handlePointerUp(event)
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
