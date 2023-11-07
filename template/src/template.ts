import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'DestylerTemplate',
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
    },
    this.modelValue,
    )
  },
})
