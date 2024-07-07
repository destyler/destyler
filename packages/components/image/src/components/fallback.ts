import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectImageRootContext } from './root'

export const imageFallbackProps = {
  asChild: {
    ...primitiveProps.asChild,
  },
  delayMs: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
} as const

export type ImageFallbackProps = ExtractPublicPropTypes<typeof imageFallbackProps>

export const ImageFallback = defineComponent({
  name: 'DestylerImageFallback',
  props: imageFallbackProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
      ? h(Primitive, {
        as: 'span',
        asChild: this.$props.asChild,
      }, () => this.$slots.default?.())
      : null
  },
})
