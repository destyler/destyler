import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { Icon as Iconify } from '@iconify/vue'

const DestylerIcon = defineComponent({
  name: 'DestylerIcon',
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const iconName = computed(() => props.name.replace(/^i-/, ''))
    return () => {
      return h(Iconify, {
        destyler: 'icon',
        icon: iconName.value,
      })
    }
  },

})

export {
  DestylerIcon,
}
