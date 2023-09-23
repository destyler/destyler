import type { PropType } from 'vue'
import { defineComponent, h, onMounted, provide, ref } from 'vue'
import { destylerToggle } from './keys'

export default defineComponent({
  name: 'DestylerToggleGroupRoot',
  props: {
    modelValue: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const select = ref<string[]>([])

    onMounted(() => {
      if (Array.isArray(props.modelValue))
        select.value = props.modelValue
      else
        select.value.push(props.modelValue)
    })

    function handleModelValue(value: string) {
      if (Array.isArray(props.modelValue)) {
        if (select.value.includes(value))
          select.value = select.value.filter(v => v !== value)
        else
          select.value.push(value)
      }
      else {
        select.value = [value]
      }

      if (Array.isArray(props.modelValue))
        emit('update:modelValue', select.value)
      else
        emit('update:modelValue', select.value[0])
    }

    provide(destylerToggle, {
      select,
      updateSelected: (value: string) => handleModelValue(value),
    })

    return () => {
      return h('div', {
        'destyler': 'toggle-root',
        'data-state': select.value,
      }, slots.default?.())
    }
  },
})
