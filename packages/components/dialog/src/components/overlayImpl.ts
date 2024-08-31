import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const dialogOverlayImplProps = {
  ...primitiveProps,
} as const

export type DialogOverlayImplProps = ExtractPublicPropTypes<typeof dialogOverlayImplProps>

export const DialogOverlayImpl = defineComponent({
  name: 'DestylerDialogOverlayImpl',
  props: dialogOverlayImplProps,

  setup() {
    const rootContext = injectDialogRootContext()
    useForwardExpose()

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
