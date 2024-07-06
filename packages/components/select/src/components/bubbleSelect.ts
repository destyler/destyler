import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, ref, toRefs } from 'vue'
import { usePrevious } from '@destyler/composition'
import { Visuallyhidden } from '@destyler/visually-hidden'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const bubbleSelectProps = {
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

export type BubbleSelectProps = ExtractPublicPropTypes<typeof bubbleSelectProps>

export const bubbleSelectEmits = {
  'update:value': (_value: any) => true,
}

export const BubbleSelect = defineComponent({
  name: 'DestylerBubbleSelect',
  props: bubbleSelectProps,
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
    return h(Visuallyhidden, {
      asChild: true,
    }, () => h('select', mergeProps(this.$props, {
      'ref': 'selectElement',
      'modelValue': this.value,
      'onUpdate:modelValue': (value: any) => {
        this.$emit('update:value', value)
      },
      'defaultValue': this.value,
    }), () => this.$slots.default?.()))
  },
})
