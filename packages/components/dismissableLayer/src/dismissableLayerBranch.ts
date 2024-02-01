import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted, onUnmounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { context } from './dismissableLayer'

export const destylerDismissableLayerBranchProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerDismissableLayerBranchProps = ExtractPublicPropTypes<typeof destylerDismissableLayerBranchProps>

export const DestylerDismissableLayerBranch = defineComponent({
  name: 'DestylerDismissableLayerBranch',
  props: destylerDismissableLayerBranchProps,
  setup() {
    const { customElement, currentElement } = useCustomElement()
    onMounted(() => {
      context.branches.add(currentElement.value)
    })
    onUnmounted(() => {
      context.branches.delete(currentElement.value)
    })

    return {
      customElement,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      ref: 'customElement',
    }), this.$slots.default?.())
  },
})
