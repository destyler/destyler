import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const comboboxCancelProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type ComboboxCancelProps = ExtractPublicPropTypes<typeof comboboxCancelProps>

export const ComboboxCancel = defineComponent({
  name: 'DestylerComboboxCancel',
  props: comboboxCancelProps,
  setup() {
    useForwardExpose()
    const rootContext = injectComboboxRootContext()

    function handleClick() {
      rootContext.searchTerm.value = ''
      rootContext.inputElement.value?.focus()
    }

    return {
      rootContext,
      handleClick,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      type: this.$props.as === 'button' ? 'button' : undefined,
      tabindex: '-1',
      onClick: () => {
        this.handleClick()
      },
    }), () => this.$slots.default?.())
  },
})
