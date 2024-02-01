import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerTemplateProps = {
  modelValue: {
    type: String as PropType<string>,
  },
} as const

export type DestylerTemplateProps = ExtractPublicPropTypes<typeof destylerTemplateProps>

export const DestylerTemplate = defineComponent({
  name: 'DestylerTemplate',
  props: destylerTemplateProps,
  setup(_) {

  },
  render() {
    return h(DestylerPrimitive, {
      as: 'div',
      asChild: false,
    }, this.modelValue)
  },
})
