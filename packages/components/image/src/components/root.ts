import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import type { ImageLoadingStatus } from '@destyler/composition'

export interface ImageRootContext {
  imageLoadingStatus: Ref<ImageLoadingStatus>
}

export const [injectImageRootContext, provideImageRootContext] = createContext<ImageRootContext>('DestylerImageRoot')

export const destylerImageRootProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerImageRootProps = ExtractPublicPropTypes<typeof destylerImageRootProps>

export const DestylerImageRoot = defineComponent({
  name: 'DestylerImageRoot',
  props: destylerImageRootProps,
  setup() {
    provideImageRootContext({
      imageLoadingStatus: ref<ImageLoadingStatus>('loading'),
    })
  },
  render() {
    return h(DestylerPrimitive, {
      as: 'span',
      asChild: this.$props.asChild,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
