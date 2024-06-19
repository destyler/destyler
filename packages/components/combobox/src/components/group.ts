import { defineComponent, h, mergeProps, nextTick, ref, watch } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useId, useMutationObserver } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const destylerComboboxGroupProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerComboboxGroupProps = ExtractPublicPropTypes<typeof destylerComboboxGroupProps>

export interface ComboboxGroupContext {
  id: string
}

export const [injectComboboxGroupContext, provideComboboxGroupContext] = createContext<ComboboxGroupContext>('DestylerComboboxGroup')

export const DestylerComboboxGroup = defineComponent({
  name: 'DestylerComboboxGroup',
  props: destylerComboboxGroupProps,
  setup() {
    const { currentRef, currentElement } = useForwardExpose()
    const id = useId()

    const rootContext = injectComboboxRootContext()
    const hasOptions = ref(false)

    function checkCollectionItem() {
      if (!currentElement.value)
        return

      const collectionItem = currentElement.value.querySelectorAll('[data-destyler-combobox-item]:not([data-hidden])')
      hasOptions.value = !!collectionItem.length
    }

    useMutationObserver(currentElement, () => {
      checkCollectionItem()
    }, { childList: true })

    watch(() => rootContext.searchTerm.value, () => {
      nextTick(() => {
        checkCollectionItem()
      })
    }, { immediate: true })

    provideComboboxGroupContext({
      id,
    })

    return {
      currentRef,
      hasOptions,
      id,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'ref': 'currentRef',
      'role': 'group',
      'aria-labelledby': this.id,
      ...this.hasOptions ? {} : { style: { display: 'none' } },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
