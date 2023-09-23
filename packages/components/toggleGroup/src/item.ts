import type { PropType, Ref } from 'vue'
import { defineComponent, h, inject } from 'vue'
import { destylerToggle } from './keys'

export default defineComponent({
  name: 'DestylerToggleItem',
  props: {
    value: {
      type: String as PropType<string>,
      required: true,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { slots }) {
    const { select, type, updateSelected } = inject(destylerToggle) as {
      select: Ref<string | string[]>
      type: Ref<boolean>
      updateSelected: (value: string) => void
    }

    function handleSelected() {
      if (!props.disabled)
        updateSelected(select.value === props.value ? '' : props.value)
    }

    return () => {
      return h('button', {
        'destyler': `accordion-item-${props.value}`,
        'data-state': select.value ? 'on' : 'off',
        'data-disabled': props.disabled,
        'onClick': handleSelected,
      }, slots.default?.())
    }
  },
})