import type { PropType } from 'vue'
import { defineComponent, h, toRefs, watch } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { useImageLoadingStatus } from '@destyler/composition'
import { injectAvatarRootContext } from './avatarRoot'

const destylerAvatarImageProps = {
  ...destylerPrimitiveProp,
  src: {
    type: String as PropType<string>,
    required: true,
    default: '',
  },
}

const DestylerAvatarImage = defineComponent({
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

export {
  DestylerAvatarImage,
  destylerAvatarImageProps,
}
