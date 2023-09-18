import { defineComponent, h, inject } from 'vue'
import { destylerHoverCard } from './key'

export default defineComponent({
  name: 'DestylerHoverCardToggle',
  setup(_, { slots }) {
    return () => {
      const { handleToggle } = inject(destylerHoverCard) as {
        handleToggle: (value: boolean) => void
      }
      return h('span', {
        destyler: 'hover-card-toggle',
        onMouseover: () => {
          handleToggle(true)
        },
        onMouseout: () => {
          handleToggle(false)
        },
      }, slots.default?.())
    }
  },
})
