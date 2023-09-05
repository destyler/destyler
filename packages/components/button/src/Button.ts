import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'DestylerButton',
  props: {
    attrType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
    focusable: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () => {
      return h('button', {
        destyler: 'button',
        type: props.attrType,
        disabled: props.disabled,
        autofocus: props.focusable,
      }, slots.default?.())
    }
  },
})
