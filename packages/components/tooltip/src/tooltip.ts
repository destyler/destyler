import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'

export default defineComponent({
  name: 'DestylerTooltip',
  props: {
    label: {
      type: String as PropType<string>,
      required: true,
    },
    delayEnter: {
      type: Number as PropType<number>,
      default: 0,
      required: false,
    },
    delayLeave: {
      type: Number as PropType<number>,
      default: 0,
      required: false,
    },
  },
  setup(props, { slots }) {
    const isHovered = ref<boolean>(false)
    let timer: ReturnType<typeof setTimeout> | undefined
    function toggle(entering: boolean) {
      const delay = entering ? props.delayEnter : props.delayLeave
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
      if (delay)
        timer = setTimeout(() => isHovered.value = entering, delay)
      else
        isHovered.value = entering
    }
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
              toggle(true)
            },
            onMouseout: () => {
              toggle(false)
            },
          }, slots.default?.({ isHovered })),
          [isHovered.value ? h('div', { destyler: 'tooltip-content' }, props.label) : null],
        ],
      )
    }
  },
})
