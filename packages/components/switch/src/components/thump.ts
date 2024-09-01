import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { Primitive, primitiveProps } from '@destyler/primitive'

import { injectSwitchRootContext } from './root'

export const switchThumbProps = {
  ...primitiveProps,
  /**
   * @default span
   */
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SwitchThumbProps = ExtractPublicPropTypes<typeof switchThumbProps>

export const SwitchThumb = defineComponent({
  name: 'DestylerSwitchThumb',
  props: switchThumbProps,
  setup(_) {
    const rootContext = injectSwitchRootContext()

    useForwardExpose()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, {
      'data-state': this.rootContext.checked?.value ? 'checked' : 'unchecked',
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
    }, () => this.$slots.default?.())
  },
})
