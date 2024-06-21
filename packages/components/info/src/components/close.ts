import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectInfoRootContext } from './root'

export const destylerInfoCloseProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerInfoCloseProps = ExtractPublicPropTypes<typeof destylerInfoCloseProps>

export const DestylerInfoClose = defineComponent({
  name: 'DestylerInfoClose',
  props: destylerInfoCloseProps,
  inheritAttrs: false,
  setup() {
    const rootContent = injectInfoRootContext()

    return {
      rootContent,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, this.$attrs, {
      onClick: () => {
        this.rootContent.onToggle()
      },
    }), () => this.$slots.default?.())
  },
})
