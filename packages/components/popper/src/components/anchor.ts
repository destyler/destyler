import type { PropType } from 'vue'
import { defineComponent, h, watch } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes, Measurable } from '@destyler/shared'

import { injectPopperRootContext } from './root'

export const destylerPopperAnchorProps = {
  ...destylerPrimitiveProps,
  element: {
    type: Object as PropType<Measurable>,
  },
} as const

export type DestylerPopperAnchorProps = ExtractPublicPropTypes<typeof destylerPopperAnchorProps>

export const DestylerPopperAnchor = defineComponent({
  name: 'DestylerPopperAnchor',
  props: destylerPopperAnchorProps,
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
    return h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      ref: (el: any) => this.forwardRef(el),
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
