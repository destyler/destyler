import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'

export default defineComponent({
  name: 'DestylerTooltip',
  props: {
    label: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const active = ref<boolean>(false)
    return () => {
      return h(
        'div',
        {
          destyler: 'tooltip-toot',
        },
        [
          h('span', {
            destyler: 'tooltip-active',
            onMouseover: () => {
              active.value = true
            },
            onMouseout: () => {
              active.value = false
            },
          }, slots.default?.()),
          [active.value ? h('div', { destyler: 'tooltip-content' }, props.label) : null],
        ],
      )
    }
  },
})
