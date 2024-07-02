import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const modalOverlayImplProps = {
  ...primitiveProps,
} as const

export type ModalOverlayImplProps = ExtractPublicPropTypes<typeof modalOverlayImplProps>

export const ModalOverlayImpl = defineComponent({
  name: 'DestylerModalOverlayImpl',
  props: modalOverlayImplProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'style': {
        'pointer-events': 'auto',
      },
    }, () => this.$slots.default?.())
  },
})
