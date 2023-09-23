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
    const select = ref<string | string[]>('')

    const type = ref<boolean>(false)

    onMounted(() => {
      type.value = Array.isArray(props.modelValue)
      select.value = props.modelValue
    })

    function handleModelValue(value: string | string[]) {
      emit('update:modelValue', value)
      if (Array.isArray(props.modelValue)) {
        select.value.push(value as string)
        return
      }
      select.value = value
    }

    provide(destylerToggle, {
      select,
      type,
      updateSelected: (value: string | string[]) => handleModelValue(value),
    })

    return () => {
      return h('div', {
        'destyler': 'toggle-root',
        'data-state': select.value,
      }, slots.default?.())
    }
  },
})
