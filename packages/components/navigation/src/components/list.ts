import { defineComponent, h, mergeProps, onMounted } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectNavigationContext } from './root'

export const destylerNavigationListProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'ul',
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
    }, () => h(DestylerPrimitive, mergeProps(this.$attrs, {
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'data-orientation': this.rootContext.orientation,
    }), {
      default: () => this.$slots.default?.(),
    }))
  },
})
