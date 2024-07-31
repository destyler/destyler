import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectInfoRootContext } from './root'

export const infoCloseProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type InfoCloseProps = ExtractPublicPropTypes<typeof infoCloseProps>

export const InfoClose = defineComponent({
  name: 'DestylerInfoClose',
  props: infoCloseProps,
  inheritAttrs: false,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContent = injectInfoRootContext()

    return {
      rootContent,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, this.$attrs, {
      'aria-label': 'Close',
      'role': 'Info Close',
      'onClick': () => {
        this.rootContent.onToggle()
      },
    }), () => this.$slots.default?.())
  },
})
