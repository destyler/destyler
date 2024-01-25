import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export const DestylerPreviewRoot = defineComponent({
  name: 'DestylerPreviewRoot',
  props: {
    modelValue: {
      type: String as PropType<string>,
    },
  },
  setup(props, { slots }) {

  },
  render() {
    return h('div', {
      destyler: this.$props.modelValue,
    }, this.modelValue)
  },
})
