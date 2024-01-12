import type { Component, PropType } from 'vue'
import {
  createVNode,
  defineComponent,
  mergeProps,
  onMounted,
  toRefs,
} from 'vue'

import { useComposedRefs, useForwardRef } from '@destyler/composition'
import { DestylerSlot } from './slot'
import type { AsTag } from './types'

const destylerPrimitiveProp = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

const destylerPrimitiveProps = {
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
}

const DestylerPrimitive = defineComponent({
  name: 'DestylerPrimitive',
  props: destylerPrimitiveProps,
  setup(props) {
    const forwarded = useForwardRef()
    const composedRefs = useComposedRefs(forwarded)

    const { asChild } = toRefs(props)
    const asTag = asChild.value ? 'template' : props.as

    onMounted(() => {
      (window as any)[Symbol.for('destyler')] = true
    })

    return {
      asTag,
      composedRefs,
    }
  },
  render() {
    const mergedProps = mergeProps(this.$attrs)
    if (this.asTag !== 'template')
      return createVNode(this.$props.as, { ...mergedProps, ref: 'composedRefs' }, this.$slots.default?.())

    return createVNode(DestylerSlot, { ...mergedProps, ref: 'composedRefs' }, this.$slots.default?.())
  },
})

export { DestylerPrimitive, destylerPrimitiveProps, destylerPrimitiveProp }
