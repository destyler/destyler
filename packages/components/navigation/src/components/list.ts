import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectNavigationContext } from './root'

export const navigationListProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'ul',
  },
} as const

export type NavigationListProps = ExtractPublicPropTypes<typeof navigationListProps>

export const NavigationList = defineComponent({
  name: 'DestylerNavigationList',
  props: navigationListProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
    return h(Primitive, {
      ref: (el: any) => this.forwardRef(el),
      style: {
        position: 'relative',
      },
    }, () => h(Primitive, mergeProps(this.$attrs, {
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'data-orientation': this.rootContext.orientation,
    }), {
      default: () => this.$slots.default?.(),
    }))
  },
})
