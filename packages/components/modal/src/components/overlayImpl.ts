import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const destylerModalOverlayImplProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerModalOverlayImplProps = ExtractPublicPropTypes<typeof destylerModalOverlayImplProps>

export const DestylerModalOverlayImpl = defineComponent({
  name: 'DestylerModalOverlayImpl',
  props: destylerModalOverlayImplProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'style': {
        'pointer-events': 'auto',
      },
    }, () => this.$slots.default?.())
  },
})
