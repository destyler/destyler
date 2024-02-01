import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerVisuallyhidden } from './visuallyHidden'

export const destylerVisuallyhiddenInputProps = {
  name: {
    type: String as PropType<string>,
    required: true,
  },
  value: {
    type: Object as PropType<any>,
    required: true,
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerVisuallyhiddenInputProps = ExtractPublicPropTypes<typeof destylerVisuallyhiddenInputProps>

export const DestylerVisuallyhiddenInput = defineComponent({
  name: 'DestylerVisuallyhiddenInput',
  props: destylerVisuallyhiddenInputProps,
  setup(props) {
    const parsedValue = computed(() => {
      if (typeof props.value === 'string' || typeof props.value === 'number' || typeof props.value === 'boolean') {
        return [{ name: props.name, value: props.value }]
      }
      else if (typeof props.value === 'object' && Array.isArray(props.value)) {
        return props.value.flatMap((obj, index) => {
          if (typeof obj === 'object')
            return Object.entries(obj).map(([key, value]) => ({ name: `[${index}][${props.name}][${key}]`, value }))
          else
            return ({ name: `[${props.name}][${index}]`, value: obj })
        })
      }
      else if (typeof props.value === 'object' && !Array.isArray(props.value)) {
        return Object.entries(props.value as object).map(([key, value]) => ({ name: `[${props.name}][${key}]`, value }))
      }
      return []
    })

    return {
      parsedValue,
    }
  },
  render() {
    return this.parsedValue.map(({ name, value }) => {
      return h(DestylerVisuallyhidden, {
        as: 'input',
        type: 'hidden',
        key: name,
        name,
        value,
        required: this.$props.required,
        disabled: this.$props.disabled,
      })
    })
  },
})
