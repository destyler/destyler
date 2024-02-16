import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectNavigationContext } from './root'

export const destylerNavigationListProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'ul',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerNavigationListProps = ExtractPublicPropTypes<typeof destylerNavigationListProps>

export const DestylerNavigationList = defineComponent({
  name: 'DestylerNavigationList',
  props: destylerNavigationListProps,
  setup() {
    const rootContext = injectNavigationContext()
    const { forwardRef, currentElement } = useForwardExpose()

    onMounted(() => {
      rootContext.onIndicatorTrackChange(currentElement.value)
    })

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      ref: (el: any) => this.forwardRef(el),
      style: {
        position: 'relative',
      },
    }, {
      default: () => {
        return h(DestylerPrimitive, mergeProps(this.$attrs, {
          'asChild': this.$props.asChild,
          'as': this.$props.as,
          'data-orientation': this.rootContext.orientation,
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
