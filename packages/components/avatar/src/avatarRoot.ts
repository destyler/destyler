import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import type { ImageLoadingStatus } from '@destyler/composition'

export interface AvatarRootContext {
  imageLoadingStatus: Ref<ImageLoadingStatus>
}

export const [injectAvatarRootContext, provideAvatarRootContext] = createContext<AvatarRootContext>('DestylerAvatarRoot')

export const destylerAvatarRootProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerAvatarRootProps = ExtractPublicPropTypes<typeof destylerAvatarRootProps>

export const DestylerAvatarRoot = defineComponent({
  name: 'DestylerAvatarRoot',
  props: destylerAvatarRootProps,
  setup() {
    provideAvatarRootContext({
      imageLoadingStatus: ref<ImageLoadingStatus>('loading'),
    })
  },
  render() {
    return h(DestylerPrimitive, {
      as: 'span',
      asChild: this.$props.asChild,
    }, this.$slots.default?.())
  },
})
