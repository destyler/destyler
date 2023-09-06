import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'DestylerCheckbox',
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    function handleClick() {
      emit('update:modelValue', !props.modelValue)
    }
    return () => {
      return h('button', {
        destyler: 'checkbox-root',
        onClick: handleClick,
      }, [props.modelValue
        ? h('span', {
          destyler: 'checkbox-item',
        }, slots.default?.())
        : null,
      ])
    }
  },
})
