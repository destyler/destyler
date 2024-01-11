import type { Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { createContext } from '@destyler/shared'
import type { ImageLoadingStatus } from '@destyler/composition'

interface AvatarRootContext {
  imageLoadingStatus: Ref<ImageLoadingStatus>
}

const [injectAvatarRootContext, provideAvatarRootContext] = createContext<AvatarRootContext>('DestylerAvatarRoot')

const DestylerAvatarRoot = defineComponent({
  name: 'DestylerAvatarRoot',
  props: destylerPrimitiveProp,
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

export {
  DestylerAvatarRoot,
  AvatarRootContext,
  injectAvatarRootContext,
  provideAvatarRootContext,
}
