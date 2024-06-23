import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'

import { injectSwitchRootContext } from './root'

export const destylerSwitchThumpProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
} as const

export type DestylerSwitchThumpProps = ExtractPublicPropTypes<typeof destylerSwitchThumpProps>

export const DestylerSwitchThump = defineComponent({
  name: 'DestylerSwitchThump',
  props: destylerSwitchThumpProps,
  setup(_) {
    const rootContext = injectSwitchRootContext()

    useForwardExpose()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'data-state': this.rootContext.checked?.value ? 'checked' : 'unchecked',
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
    }, () => this.$slots.default?.())
  },
})
