import { Teleport, Transition, defineComponent, h } from 'vue'

export default defineComponent({
  name: 'DestylerDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    function handleVisible() {
      emit('update:modelValue', !props.modelValue)
    }
    return () => {
      return h(Teleport, {
        to: 'body',
      },
      h(Transition, {
        name: 'destyler-dialog',
        appear: true,
      },
      [props.modelValue
        ? h('div', {
          destyler: 'dialog-root',
        }, slots.default?.({ handleVisible }))
        : null,
      ],
      ))
    }
  },
})
