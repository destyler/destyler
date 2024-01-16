import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { Icon as Iconify } from '@iconify/vue'

export const DestylerIcon = defineComponent({
  name: 'DestylerIcon',
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const iconName = computed(() => props.name.replace(/^i-/, ''))
    return {
      iconName,
    }
  },
  render() {
    return h(Iconify, {
      destyler: 'icon',
      icon: this.iconName,
    })
  },

})
