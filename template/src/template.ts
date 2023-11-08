import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

const DestylerTemplate = defineComponent({
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

export {
  DestylerTemplate,
}
