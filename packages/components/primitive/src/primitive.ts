import type { PropType } from 'vue'
import {
  createVNode,
  defineComponent,
  mergeProps,
  onMounted,
  toRefs,
} from 'vue'

import { useComposedRefs, useForwardRef } from '@destyler/composition'
import { DestylerSlot } from './slot'
import { NODES } from './types'
import type { DestylerElement, Primitives } from './types'

const Primitive = NODES.reduce((primitive, node) => {
  const selectNode = defineComponent({
    name: `Primitive${node}`,
    inheritAttrs: false,
    props: {
      asChild: Boolean as PropType<boolean>,
    },
    setup(props) {
      const forwarded = useForwardRef()
      const composedRefs = useComposedRefs(forwarded)

      const { asChild, ...primitiveProps } = toRefs(props)

      onMounted(() => {
        (window as any)[Symbol.for('destyler')] = true
      })

      const Tag: any = asChild.value ? DestylerSlot : node

      return {
        Tag,
        primitiveProps,
        composedRefs,
      }
    },
    render() {
      const mergedProps = mergeProps(this.$attrs, this.primitiveProps)

      return createVNode(this.Tag, { ...mergedProps, ref: 'composedRefs' }, this.$slots)
    },
  })

  const NodeProps = selectNode as typeof selectNode & (new () => { $props: DestylerElement<typeof node, true> })

  return { ...primitive, [node]: NodeProps }
}, {} as Primitives)

const DestylerPrimitive = Primitive

export { DestylerPrimitive, Primitive }
