import type { PropType, Ref } from 'vue'
import { defineComponent, h, inject } from 'vue'
import { destylerAccordion } from './keys'

export default defineComponent({
  name: 'DestylerAccordionItem',
  props: {
    value: {
      type: String as PropType<string>,
      required: true,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
      required: false,
    },
  },
  setup(props, { slots }) {
    const { select, updateSelected } = inject(destylerAccordion) as {
      select: Ref<string>
      updateSelected: (value: string) => void
    }

    function handleSelected() {
      if (!props.disabled)
        updateSelected(select.value === props.value ? '' : props.value)
    }
    return () => {
      return h('div', {
        'destyler': 'accordion-item',
        'accordion-item-status': select.value === props.value,
        'accordion-item-disabled': props.disabled,
      }, [
        h('div', {
          destyler: 'accordion-item-header',
          onClick: handleSelected,
        }, slots.header?.()),
        h('div', {
          destyler: 'accordion-item-content',
          style: {
            display: select.value === props.value ? '' : 'none',
          },
        }, slots.conter?.()),
      ])
    }
  },
})
