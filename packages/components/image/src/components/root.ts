import type { Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import type { ImageLoadingStatus } from '@destyler/composition'

export interface ImageRootContext {
  imageLoadingStatus: Ref<ImageLoadingStatus>
}

export const [injectImageRootContext, provideImageRootContext] = createContext<ImageRootContext>('DestylerImageRoot')

export const imageRootProps = {
  asChild: {
    ...primitiveProps.asChild,
  },
} as const

export type ImageRootProps = ExtractPublicPropTypes<typeof imageRootProps>

export const ImageRoot = defineComponent({
  name: 'DestylerImageRoot',
  props: imageRootProps,

  setup() {
    provideImageRootContext({
      imageLoadingStatus: ref<ImageLoadingStatus>('loading'),
    })
  },
  render() {
    return h(Primitive, {
      as: 'span',
      asChild: this.$props.asChild,
    }, () => this.$slots.default?.())
  },
})
