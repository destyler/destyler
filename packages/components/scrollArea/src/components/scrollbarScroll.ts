import { defineComponent, h, mergeProps, watchEffect } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useDebounceFn, useForwardExpose, useStateMachine } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarContext } from './scrollbar'
import { ScrollAreaScrollbarVisible } from './scrollbarVisible'

export const scrollAreaScrollbarScrollProps = {
  forceMount: {
    type: Boolean,
    required: false,
  },
} as const

export type ScrollAreaScrollbarScrollProps = ExtractPublicPropTypes<typeof scrollAreaScrollbarScrollProps>

export const ScrollAreaScrollbarScroll = defineComponent({
  name: 'DestylerScrollAreaScrollbarScroll',
  props: scrollAreaScrollbarScrollProps,
  setup() {
    const rootContext = injectScrollAreaRootContext()
    const scrollbarContext = injectScrollAreaScrollbarContext()

    const { forwardRef } = useForwardExpose()

    const { state, dispatch } = useStateMachine('hidden', {
      hidden: {
        SCROLL: 'scrolling',
      },
      scrolling: {
        SCROLL_END: 'idle',
        POINTER_ENTER: 'interacting',
      },
      interacting: {
        SCROLL: 'interacting',
        POINTER_LEAVE: 'idle',
      },
      idle: {
        HIDE: 'hidden',
        SCROLL: 'scrolling',
        POINTER_ENTER: 'interacting',
      },
    })

    watchEffect((onCleanup) => {
      if (state.value === 'idle') {
        const timeId = window.setTimeout(
          () => dispatch('HIDE'),
          rootContext.scrollHideDelay.value,
        )

        onCleanup(() => {
          window.clearTimeout(timeId)
        })
      }
    })

    const debounceScrollEnd = useDebounceFn(() => dispatch('SCROLL_END'), 100)

    watchEffect((onCleanup) => {
      const viewport = rootContext.viewport.value
      const scrollDirection = scrollbarContext.isHorizontal.value
        ? 'scrollLeft'
        : 'scrollTop'

      if (viewport) {
        let prevScrollPos = viewport[scrollDirection]
        const handleScroll = () => {
          const scrollPos = viewport[scrollDirection]
          const hasScrollInDirectionChanged = prevScrollPos !== scrollPos
          if (hasScrollInDirectionChanged) {
            dispatch('SCROLL')
            debounceScrollEnd()
          }
          prevScrollPos = scrollPos
        }
        viewport.addEventListener('scroll', handleScroll)

        onCleanup(() => {
          viewport.removeEventListener('scroll', handleScroll)
        })
      }
    })

    return {
      forwardRef,
      state,
    }
  },
  render() {
    return h(Presence, {
      present: this.$props.forceMount || this.state !== 'hidden',
    }, {
      default: () => {
        return h(ScrollAreaScrollbarVisible, mergeProps(this.$props, {
          ref: (el: any) => this.forwardRef(el),
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
