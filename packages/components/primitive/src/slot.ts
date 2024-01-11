import { cloneVNode, defineComponent, mergeProps } from 'vue'
import { renderSlotFragments } from '@destyler/shared'

const DestylerSlot = defineComponent({
  name: 'DestylerSlot',
  inheritAttrs: false,
  render() {
    if (!this.$slots.default)
      return null
    const childrens = renderSlotFragments(this.$slots.default())

    const [firstChildren, ...otherChildren] = childrens

    if (Object.keys(this.$attrs).length > 0) {
    // remove props ref from being inferred
      delete firstChildren.props?.ref
      const mergedProps = mergeProps(this.$attrs, firstChildren.props ?? {})
      // remove class to prevent duplicated
      if (this.$attrs.class && firstChildren.props?.class)
        delete firstChildren.props.class

      const cloned = cloneVNode(firstChildren, mergedProps)
      // Explicitly override props starting with `on`.
      // It seems cloneVNode from Vue doesn't like overriding `onXXX` props. So
      // we have to do it manually.
      for (const prop in mergedProps) {
        if (prop.startsWith('on')) {
          cloned.props ||= {}
          cloned.props[prop] = mergedProps[prop]
        }
      }

      return childrens.length === 1 ? cloned : [cloned, ...otherChildren]
    }

    return childrens
  },
})

export {
  DestylerSlot,
}
