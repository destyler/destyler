import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { injectModalRootContext } from './modalRoot'

export const destylerModalOverlayImplProps = {
  ...destylerPrimitiveProps,
}

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
    }, this.$slots.default?.())
  },
})
