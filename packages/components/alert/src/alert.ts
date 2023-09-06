import { defineComponent, h, ref } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'DestylerAlert',
  props: {
    duration: {
      type: Number as PropType<number>,
      default: 3000,
      required: false,
    },
  },
  setup(props, { slots }) {
    const show = ref(true)

    setTimeout(() => {
      show.value = false
    }, props.duration)

    return () => {
      if (show.value) {
        return h('div', {
          destyler: 'alert',
        }, slots.default?.())
      }
    }
  },
})
