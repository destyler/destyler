import type { PropType } from 'vue'
import { defineComponent, h, toRefs, watch } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import { useImageLoadingStatus } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectImageRootContext } from './root'

export const destylerImageProps = {
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

export type DestylerImageProps = ExtractPublicPropTypes<typeof destylerImageProps>

export const DestylerImage = defineComponent({
  name: 'DestylerImage',
  props: destylerImageProps,
  emits: ['loadingStatusChange'],
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
      ? h(DestylerPrimitive, {
        as: 'img',
        role: 'img',
        asChild: this.$props.asChild,
        src: this.src,
      }, () => this.$slots.default?.())
      : null
  },
})
