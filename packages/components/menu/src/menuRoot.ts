import type { PropType } from 'vue'
import { defineComponent, h, onMounted, provide, ref } from 'vue'
import { destylerMenu } from './key'

export default defineComponent({
  name: 'DestylerMenuRoot',
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const show = ref<boolean>(false)

    onMounted(() => {
      show.value = props.modelValue
    })

    provide(destylerMenu, {
      show,
    })

    function handleModelValue() {
      emit('update:modelValue', !show.value)
      show.value = !show.value
    }

    return () => {
      return h('div', {
        destyler: 'menu-root',
      }, slots.default?.({ handleModelValue }))
    }
  },
})
