import type { Ref } from 'vue'
import { defineComponent, h, inject } from 'vue'
import { destylerHoverCard } from './key'

export default defineComponent({
  name: 'DestylerHoverCardItem',
  setup(_, { slots }) {
    const { isHovered } = inject(destylerHoverCard) as {
      isHovered: Ref<boolean>
    }
    return () => {
      return [isHovered.value
        ? h('div', {
          destyler: 'hover-card-item',
        }, slots.default?.())
        : null]
    }
  },
})
