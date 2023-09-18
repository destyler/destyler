import type { PropType } from 'vue'
import { defineComponent, h, provide, ref } from 'vue'
import { destylerHoverCard } from './key'

export default defineComponent({
  name: 'DestylerHoverCard',
  props: {
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
    provide(destylerHoverCard, {
      isHovered,
      handleToggle: (value: boolean) => toggle(value),
    })
    return () => {
      return h('div', {
        destyler: 'hover-card-root',
      }, slots.default?.({ isHovered, toggle }))
    }
  },
})
