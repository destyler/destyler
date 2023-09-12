import type { Ref } from 'vue'
import { defineComponent, h, inject } from 'vue'
import { destylerMenu } from './key'

export default defineComponent({
  name: 'DestylerMenuItems',
  setup(_, { slots }) {
    const { show } = inject(destylerMenu) as {
      show: Ref<boolean>
    }
    return () => {
      if (show.value) {
        return h('div', {
          destyler: 'menu-items',
        }, slots.default?.())
      }
    }
  },
})
