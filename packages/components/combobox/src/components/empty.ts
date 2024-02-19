import type { Component, PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const destylerComboboxEmptyProps = {
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

export type DestylerComboboxEmptyProps = ExtractPublicPropTypes<typeof destylerComboboxEmptyProps>

export const DestylerComboboxEmpty = defineComponent({
  name: 'DestylerComboboxEmpty',
  props: destylerComboboxEmptyProps,
  setup() {
    useForwardExpose()
    const rootContext = injectComboboxRootContext()
    const isEmpty = computed(() => rootContext.filteredOptions.value.length === 0)

    return {
      rootContext,
      isEmpty,
    }
  },
  render() {
    if (this.isEmpty) {
      return h(DestylerPrimitive, this.$props, {
        default: () => this.$slots.default ? this.$slots.default?.() : 'No options',
      })
    }
  },
})
