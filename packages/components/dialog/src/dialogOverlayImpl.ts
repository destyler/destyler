import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { injectDialogRootContext } from './dialogRoot'

export const destylerDialogOverlayImplProps = {
  ...destylerPrimitiveProps,
}

export const DestylerDialogOverlayImpl = defineComponent({
  name: 'DestylerDialogOverlayImpl',
  props: destylerDialogOverlayImplProps,
  setup() {
    const rootContext = injectDialogRootContext()

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
