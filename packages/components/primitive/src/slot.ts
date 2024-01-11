import { cloneVNode, createVNode, defineComponent, mergeProps } from 'vue'
import { useComposedRefs, useForwardRef } from '@destyler/composition'
import { isSlottable } from './utils'

const DestylerSlot = defineComponent({
  name: 'DestylerSlot',
  inheritAttrs: false,
  setup() {
    const forwarded = useForwardRef()
    const composedRefs = useComposedRefs(forwarded)

    return {
      composedRefs,
    }
  },
  render() {
    const defaultSlot = this.$slots.default?.()
    const slottable = defaultSlot?.find(isSlottable)
    if (slottable && defaultSlot?.length) {
      // TODO: fix any
      const newParentElement = (slottable.children as any)?.default?.()[0]

      const newChildren = defaultSlot.map((child) => {
        if (child === slottable)
          return newParentElement.children

        else return child
      })

      return createVNode(newParentElement.type, {
        ...mergeProps(this.$attrs, this.$props, newParentElement.props),
        ref: 'composedRefs',
      }, newChildren)
    }
    else if (defaultSlot) {
      if (defaultSlot.length > 1)
        console.error(`DestylerSlot can only contain a single child, but found ${defaultSlot.length} children. Please use a single wrapper element.`)

      const [child] = defaultSlot
      const slot = cloneVNode(child, { ...mergeProps(this.$attrs, this.$props), ref: 'composedRefs' }, true)

      return slot
    }
    else {
      return null
    }
  },
})

const DestylerSlottable = defineComponent({
  name: 'DestylerSlottable',
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => slots.default ? slots.default?.() : null
  },
})

export { DestylerSlot, DestylerSlottable }
