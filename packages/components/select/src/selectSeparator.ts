import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'

export const destylerSelectSeparatorProps = {
  ...destylerPrimitiveProps,
}

export const DestylerSelectSeparator = defineComponent({
  name: 'DestylerSelectSeparator',
  props: destylerSelectSeparatorProps,
  render() {
    return h(DestylerPrimitive, this.$props, this.$slots.default?.())
  },
})
