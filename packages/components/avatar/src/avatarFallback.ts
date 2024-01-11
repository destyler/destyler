import type { PropType } from 'vue'
import { defineComponent, h, ref, watch } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { injectAvatarRootContext } from './avatarRoot'

const destylerAvatarFallbackProps = {
  ...destylerPrimitiveProp,
  delayMs: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
}

const DestylerAvatarFallback = defineComponent({
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

export {
  DestylerAvatarFallback,
  destylerAvatarFallbackProps,
}
