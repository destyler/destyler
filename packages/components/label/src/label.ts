import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

const DestylerLabel = defineComponent({
  name: 'DestylerLabel',
  props: {
    as: {
      type: String as PropType<'label'>,
      required: false,
      default: 'label',
    },
    for: {
      type: String,
      required: false,
    },
  },
  setup() {
    function handleMousedown(e: MouseEvent): void {
      if (!e.defaultPrevented && e.detail > 1)
        e.preventDefault()
    }

    return {
      handleMousedown,
    }
  },
  render() {
    return h(this.as, {
      for: this.for,
      destyler: 'label',
      onMousedown: this.handleMousedown,
    }, this.$slots.default?.())
  },
})

export {
  DestylerLabel,
}
