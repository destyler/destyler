import { defineComponent, h, mergeProps, onMounted, onUnmounted } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import { context } from './dismissableLayer'

export const destylerDismissableLayerBranchProps = {
  ...destylerPrimitiveProps,
}

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
