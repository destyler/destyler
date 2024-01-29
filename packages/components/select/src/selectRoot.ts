import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerSelectRootProps = {
  modelValue: {
    type: String as PropType<string>,
    required: true,
    default: '',
  },
}

export type DestylerSelectRootProps = ExtractPublicPropTypes<typeof destylerSelectRootProps>

export const DestylerSelectRoot = defineComponent({
  name: 'DestylerSelectRoot',
  props: destylerSelectRootProps,
  setup(props, { slots }) {

  },
  render() {
    return h('div', {
      destyler: this.$props.modelValue,
    }, this.modelValue)
  },
})
