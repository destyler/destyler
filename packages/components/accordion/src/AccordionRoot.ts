import type { PropType } from 'vue'
import { defineComponent, h, onMounted, provide, ref } from 'vue'
import { destylerAccordion } from './keys'

export default defineComponent({
  name: 'DestylerAccordionRoot',
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const select = ref<string>('')

    onMounted(() => {
      select.value = props.modelValue
    })

    provide(destylerAccordion, {
      select,
      updateSelected: (value: string) => handleModelValue(value),
    })

    function handleModelValue(value: string) {
      emit('update:modelValue', value)
      select.value = value
    }

    return () => {
      return h('div', {
        destyler: 'accordion-root',
      }, slots.default?.())
    }
  },
})
