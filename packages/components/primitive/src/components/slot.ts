import { cloneVNode, defineComponent, mergeProps } from 'vue'
import { renderSlotFragments } from '@destyler/shared'

export const Slot = defineComponent({
  name: 'DestylerSlot',
  inheritAttrs: false,

  setup() {
  },
  render() {
    if (!this.$slots.default)
      return null
    const childrens = renderSlotFragments(this.$slots.default())
    const firstNonCommentChildrenIndex = childrens.findIndex(child => child.type !== Comment)
    if (firstNonCommentChildrenIndex === -1)
      return childrens

    const firstNonCommentChildren = childrens[firstNonCommentChildrenIndex]

    // remove props ref from being inferred
    delete firstNonCommentChildren.props?.ref

    const mergedProps = firstNonCommentChildren.props
      ? mergeProps(this.$attrs, firstNonCommentChildren.props)
      : this.$attrs
      // remove class to prevent duplicated
    if (this.$attrs.class && firstNonCommentChildren.props?.class)
      delete firstNonCommentChildren.props.class
    const cloned = cloneVNode(firstNonCommentChildren, mergedProps)

    // Explicitly override props starting with `on`.
    // It seems cloneVNode from Vue doesn't like overriding `onXXX` props.
    // So we have to do it manually.
    for (const prop in mergedProps) {
      if (prop.startsWith('on')) {
        cloned.props ||= {}
        cloned.props[prop] = mergedProps[prop]
      }
    }

    if (childrens.length === 1)
      return cloned

    childrens[firstNonCommentChildrenIndex] = cloned
    return childrens
  },
})
