import { defineComponent, h, mergeProps, onMounted, onUnmounted } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { context } from './dismissableLayer'

export const destylerDismissableLayerBranchProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerDismissableLayerBranchProps = ExtractPublicPropTypes<typeof destylerDismissableLayerBranchProps>

export const DestylerDismissableLayerBranch = defineComponent({
  name: 'DestylerDismissableLayerBranch',
  props: destylerDismissableLayerBranchProps,
  setup() {
    const { forwardRef, currentElement } = useForwardExpose()
    onMounted(() => {
      context.branches.add(currentElement.value)
    })
    onUnmounted(() => {
      context.branches.delete(currentElement.value)
    })

    return {
      forwardRef,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      ref: (el: any) => this.forwardRef(el),
    }), () => this.$slots.default?.())
  },
})
