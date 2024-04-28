import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectInfoRootContext } from './root'

export const destylerInfoCloseProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
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
