import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'DestylerToggle',
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    function handleClick() {
      if (!props.disabled)
        emit('update:modelValue', !props.modelValue)
    }
    return () => {
      return h('button', {
        'destyler': 'toggle',
        'data-state': props.modelValue ? 'on' : 'off',
        'data-disabled': props.disabled,
        'onClick': handleClick,
      }, slots.default?.())
    }
  },
})
