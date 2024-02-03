import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, ref, toRefs } from 'vue'
import { usePrevious } from '@destyler/composition'
import { DestylerVisuallyhidden } from '@destyler/visually-hidden'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerBubbleSelectProps = {
  autocomplete: {
    type: String as PropType<string>,
  },
  autofocus: {
    type: Boolean as PropType<boolean>,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
  },
  form: {
    type: String as PropType<string>,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
  },
  name: {
    type: String as PropType<string>,
  },
  required: {
    type: Boolean as PropType<boolean>,
  },
  size: {
    type: Number as PropType<number>,
  },
  value: {
    type: Object as PropType<any>,
  },
} as const

export type DestylerBubbleSelectProps = ExtractPublicPropTypes<typeof destylerBubbleSelectProps>

export const DestylerBubbleSelect = defineComponent({
  name: 'DestylerBubbleSelect',
  props: destylerBubbleSelectProps,
  emits: ['update:value'],
  setup(props) {
    const { value } = toRefs(props)
    const prevValue = usePrevious(value)
    const selectElement = ref<HTMLElement>()

    return {
      value,
      prevValue,
      selectElement,
    }
  },
  render() {
    return h(DestylerVisuallyhidden, {
      asChild: true,
    }, h('select', mergeProps(this.$props, {
      'ref': 'selectElement',
      'modelValue': this.value,
      'onUpdate:modelValue': (value: any) => {
        this.$emit('update:value', value)
      },
      'defaultValue': this.value,
    }), {
      default: () => this.$slots.default?.(),
    }))
  },
})
