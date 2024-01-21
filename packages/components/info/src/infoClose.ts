import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'

import { injectInfoRootContext } from './infoRoot'

export const destylerInfoCloseProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
}

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
    }), this.$slots.default?.())
  },
})
