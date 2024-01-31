import type { PropType } from 'vue'
import { defineComponent, h, ref, watch } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectAvatarRootContext } from './avatarRoot'

export const destylerAvatarFallbackProps = {
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
}

export type DestylerAvatarFallbackProps = ExtractPublicPropTypes<typeof destylerAvatarFallbackProps>

export const DestylerAvatarFallback = defineComponent({
  name: 'DestylerAvatarFallback',
  props: destylerAvatarFallbackProps,
  setup(props) {
    const rootContext = injectAvatarRootContext()

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
      }, this.$slots.default?.())
      : null
  },
})
