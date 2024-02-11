import type { ExtractPublicPropTypes } from '@destyler/shared'
import { defineComponent, h, mergeProps, onMounted, onUnmounted, ref } from 'vue'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { DestylerScrollAreaScrollbarAuto, destylerScrollAreaScrollbarAutoProps } from './scrollbarAuto'
import { injectScrollAreaRootContext } from './root'

export const destylerScrollAreaScrollbarHoverProps = {
  ...destylerScrollAreaScrollbarAutoProps,
} as const

export type DestylerScrollAreaScrollbarHoverProps = ExtractPublicPropTypes<typeof destylerScrollAreaScrollbarHoverProps>

export const DestylerScrollAreaScrollbarHover = defineComponent({
  name: 'DestylerScrollAreaScrollbarHover',
  inheritAttrs: false,
  props: destylerScrollAreaScrollbarHoverProps,
  setup() {
    const rootContext = injectScrollAreaRootContext()

    const { forwardRef } = useForwardExpose()

    let timeout: ReturnType<typeof setTimeout> | undefined | number
    const visible = ref(false)

    function handlePointerEnter() {
      window.clearTimeout(timeout)
      visible.value = true
    }
    function handlePointerLeave() {
      timeout = window.setTimeout(() => {
        visible.value = false
      }, rootContext.scrollHideDelay.value)
    }

    onMounted(() => {
      const scrollArea = rootContext.scrollArea.value

      if (scrollArea) {
        scrollArea.addEventListener('pointerenter', handlePointerEnter)
        scrollArea.addEventListener('pointerleave', handlePointerLeave)
      }
    })

    onUnmounted(() => {
      const scrollArea = rootContext.scrollArea.value
      if (scrollArea) {
        window.clearTimeout(timeout)
        scrollArea.removeEventListener('pointerenter', handlePointerEnter)
        scrollArea.removeEventListener('pointerleave', handlePointerLeave)
      }
    })

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
        return h(DestylerScrollAreaScrollbarAuto, mergeProps(this.$attrs, {
          'ref': 'forwardRef',
          'data-state': this.visible ? 'visible' : 'hidden',
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
