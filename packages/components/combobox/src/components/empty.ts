import { computed, defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const destylerComboboxEmptyProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
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
