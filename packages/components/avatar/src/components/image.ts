import type { PropType } from 'vue'
import { defineComponent, h, toRefs, watch } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import { useImageLoadingStatus } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectAvatarRootContext } from './root'

export const destylerAvatarImageProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  src: {
    type: String as PropType<string>,
    required: true,
    default: '',
  },
} as const

export type DestylerAvatarImageProps = ExtractPublicPropTypes<typeof destylerAvatarImageProps>

export const DestylerAvatarImage = defineComponent({
  name: 'DestylerAvatarImage',
  props: destylerAvatarImageProps,
  emits: ['loadingStatusChange'],
  setup(props, { emit }) {
    const { src } = toRefs(props)
    const rootContext = injectAvatarRootContext()

    const imageLoadingStatus = useImageLoadingStatus(src)

    watch(
      imageLoadingStatus,
      (newValue) => {
        emit('loadingStatusChange', newValue)
        if (newValue !== 'idle')
          rootContext.imageLoadingStatus.value = newValue
      },
      { immediate: true },
    )

    return {
      rootContext,
      src,
    }
  },
  render() {
    const useVShow = this.rootContext.imageLoadingStatus.value === 'loaded'
    return useVShow
      ? h(DestylerPrimitive, {
        as: 'img',
        role: 'img',
        asChild: this.$props.asChild,
        src: this.src,
      }, this.$slots.default?.())
      : null
  },
})
