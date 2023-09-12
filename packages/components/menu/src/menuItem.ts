import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'

export default defineComponent({
  name: 'DestylerMenuItem',
  props: {
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
      required: false,
    },
  },
  emits: ['on'],
  setup(props, { emit, slots }) {
    const active = ref<boolean>(false)
    function handleOn() {
      if (!props.disabled)
        emit('on')
    }
    return () => {
      return h('div', {
        destyler: 'menu-item',
        onMouseover: () => {
          active.value = true
        },
        onMouseout: () => {
          active.value = false
        },
        onClick: handleOn,
      }, slots.default?.({ active }))
    }
  },
})
