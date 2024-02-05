import type { PropType } from 'vue'
import { defineComponent, h, ref, watch } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectImageRootContext } from './root'

export const destylerImageFallbackProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  delayMs: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
} as const

export type DestylerImageFallbackProps = ExtractPublicPropTypes<typeof destylerImageFallbackProps>

export const DestylerImageFallback = defineComponent({
  name: 'DestylerImageFallback',
  props: destylerImageFallbackProps,
  setup(props) {
    const rootContext = injectImageRootContext()

    const canRender = ref(false)
    let timeout: ReturnType<typeof setTimeout> | undefined

    watch(rootContext.imageLoadingStatus, (value) => {
      if (value === 'loading') {
        canRender.value = false
        if (props.delayMs) {
          timeout = setTimeout(() => {
            canRender.value = true
            clearTimeout(timeout)
          }, props.delayMs)
        }
        else {
          canRender.value = true
        }
      }
    }, { immediate: true })

    return {
      canRender,
      rootContext,
    }
  },
  render() {
    const useVShow = this.rootContext.imageLoadingStatus.value !== 'loaded' && this.canRender
    return useVShow
      ? h(DestylerPrimitive, {
        as: 'span',
        asChild: this.$props.asChild,
      }, {
        default: () => this.$slots.default?.(),
      })
      : null
  },
})
