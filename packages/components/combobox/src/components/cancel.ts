import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const destylerComboboxCancelProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerComboboxCancelProps = ExtractPublicPropTypes<typeof destylerComboboxCancelProps>

export const DestylerComboboxCancel = defineComponent({
  name: 'DestylerComboboxCancel',
  props: destylerComboboxCancelProps,
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
    return h(DestylerPrimitive, mergeProps(this.$props, {
      type: this.$props.as === 'button' ? 'button' : undefined,
      tabindex: '-1',
      onClick: () => {
        this.handleClick()
      },
    }), () => this.$slots.default?.())
  },
})
