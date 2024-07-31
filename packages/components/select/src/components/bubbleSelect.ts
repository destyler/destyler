import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, ref, toRefs, vModelSelect, withDirectives } from 'vue'
import { usePrevious } from '@destyler/composition'
import { VisuallyHidden } from '@destyler/visually-hidden'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const bubbleSelectProps = {
  autocomplete: {
    type: String as PropType<string>,
    required: false,
  },
  autofocus: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  form: {
    type: String as PropType<string>,
    required: false,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  size: {
    type: Number as PropType<number>,
    required: false,
  },
  value: {
    required: false,
  },
} as const

export type BubbleSelectProps = ExtractPublicPropTypes<typeof bubbleSelectProps>

export const BubbleSelect = defineComponent({
  name: 'DestylerBubbleSelect',
  props: bubbleSelectProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
    return h(VisuallyHidden, {
      asChild: true,
    }, () => withDirectives(h('select', mergeProps(this.$props, {
      'ref': 'selectElement',
      'onUpdate:modelValue': (value: any) => {
        this.value = value
      },
      'defaultValue': this.value,
    }), this.$slots.default?.()), [
      [vModelSelect, this.value],
    ]))
  },
})
