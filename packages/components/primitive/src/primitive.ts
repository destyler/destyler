import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'

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
    const asTag = props.asChild ? 'template' : props.as

    return {
      asTag,
    }
  },
  render() {
    if (this.asTag !== 'template') 
      return h(this.$props.as, this.$attrs, this.$slots.default?.())
    
    else 
      return h(DestylerSlot, this.$attrs, this.$slots.default?.())
    
  },
})

export { DestylerPrimitive, destylerPrimitiveProps, destylerPrimitiveProp }
