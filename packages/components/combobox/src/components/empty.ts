import { computed, defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const comboboxEmptyProps = {
  ...primitiveProps,
} as const

export type ComboboxEmptyProps = ExtractPublicPropTypes<typeof comboboxEmptyProps>

export const ComboboxEmpty = defineComponent({
  name: 'DestylerComboboxEmpty',
  props: comboboxEmptyProps,

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
      return h(Primitive, this.$props, {
        default: () => this.$slots.default ? this.$slots.default?.() : 'No options',
      })
    }
  },
})
