import type { PropType } from 'vue'
import { defineComponent, h, watch } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import type { Measurable } from './popperRoot'
import { injectPopperRootContext } from './popperRoot'

const destylerPopperAnchorProps = {
  ...destylerPrimitiveProps,
  element: {
    type: Object as PropType<Measurable>,
  },
}

export const DestylerPopperAnchor = defineComponent({
  name: 'DestylerPopperAnchor',
  props: destylerPopperAnchorProps,
  setup(props) {
    const { customElement, currentElement } = useCustomElement()

    const rootContext = injectPopperRootContext()

    watch(currentElement, () => {
      rootContext.onAnchorChange(props.element ?? currentElement.value)
    })

    return {
      customElement,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      ref: 'customElement',
    }, this.$slots.default?.())
  },
})
