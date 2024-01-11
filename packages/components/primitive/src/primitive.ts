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

const DestylerPrimitive: any = defineComponent({
  name: 'DestylerPrimitive',
  props: {
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
  },
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
      return createVNode(this.$props.as, { ...mergedProps, ref: 'composedRefs' }, this.$slots)

    return createVNode(DestylerSlot, { ...mergedProps, ref: 'composedRefs' }, this.$slots)
  },
})

export { DestylerPrimitive }
