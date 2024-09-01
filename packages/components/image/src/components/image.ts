import type { PropType } from 'vue'
import { defineComponent, h, toRefs, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useImageLoadingStatus } from '@destyler/composition'
import type { ImageLoadingStatus } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectImageRootContext } from './root'

export const imageProps = {
  asChild: {
    ...primitiveProps.asChild,
  },
  /**
   * image source
   */
  src: {
    type: String as PropType<string>,
    required: true,
    default: '',
  },
} as const

export type ImageProps = ExtractPublicPropTypes<typeof imageProps>

export const imageEmits = {
  /**
   * A callback providing information about the loading status of the image. <br>
   * This is useful in case you want to control more precisely what to render as the image is loading.
   */
  loadingStatusChange: (_status: ImageLoadingStatus) => true,
}

export const Image = defineComponent({
  name: 'DestylerImage',
  props: imageProps,
  emits: imageEmits,
  setup(props, { emit }) {
    const { src } = toRefs(props)
    const rootContext = injectImageRootContext()

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
      ? h(Primitive, {
        as: 'img',
        role: 'img',
        asChild: this.$props.asChild,
        src: this.src,
      }, () => this.$slots.default?.())
      : null
  },
})
