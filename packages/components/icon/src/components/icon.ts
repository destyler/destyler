import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { Icon as Iconify } from '@iconify/vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const iconProps = {
  name: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type IconProps = ExtractPublicPropTypes<typeof iconProps>

export const Icon = defineComponent({
  name: 'DestylerIcon',
  props: iconProps,
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
