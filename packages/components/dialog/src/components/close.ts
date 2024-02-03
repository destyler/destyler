import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDialogRootContext } from './root'

export const destylerDialogCloseProps = {
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

export type DestylerDialogCloseProps = ExtractPublicPropTypes<typeof destylerDialogCloseProps>

export const DestylerDialogClose = defineComponent({
  name: 'DestylerDialogClose',
  props: destylerDialogCloseProps,
  setup() {
    const rootContext = injectDialogRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      type: this.$props.as === 'button' ? 'button' : undefined,
      onClick: () => {
        this.rootContext.onOpenChange(false)
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
