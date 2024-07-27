import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes, Measurable } from '@destyler/shared'

import { injectPopperRootContext } from './root'

export const popperAnchorProps = {
  ...primitiveProps,
  element: {
    type: Object as PropType<Measurable>,
    required: false,
  },
} as const

export type PopperAnchorProps = ExtractPublicPropTypes<typeof popperAnchorProps>

export const PopperAnchor = defineComponent({
  name: 'DestylerPopperAnchor',
  props: popperAnchorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const { forwardRef, currentElement } = useForwardExpose()

    const rootContext = injectPopperRootContext()

    watch(currentElement, () => {
      rootContext.onAnchorChange(props.element ?? currentElement.value)
    })

    return {
      forwardRef,
    }
  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      ref: (el: any) => this.forwardRef(el),
    }, () => this.$slots.default?.())
  },
})
