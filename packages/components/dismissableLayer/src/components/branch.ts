import { defineComponent, h, mergeProps, onMounted, onUnmounted } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { context } from './dismissableLayer'

export const dismissableLayerBranchProps = {
  ...primitiveProps,
} as const

export type DismissableLayerBranchProps = ExtractPublicPropTypes<typeof dismissableLayerBranchProps>

export const DismissableLayerBranch = defineComponent({
  name: 'DestylerDismissableLayerBranch',
  props: dismissableLayerBranchProps,

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
    return h(Primitive, mergeProps(this.$props, {
      ref: (el: any) => this.forwardRef(el),
    }), () => this.$slots.default?.())
  },
})
