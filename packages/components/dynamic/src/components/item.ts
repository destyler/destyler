import { computed, defineComponent, h, toRefs } from 'vue'
import type { PropType, Ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useId } from '@destyler/composition'
import { createContext } from '@destyler/shared'
import { DestylerCollectionItem } from '@destyler/collection'

import { injectDynamicRootContext } from './root'

export const destylerDynamicItemProps = {
  ...destylerPrimitiveProps,
  value: {
    type: String as PropType<string>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerDynamicItemProops = ExtractPublicPropTypes<typeof destylerDynamicItemProps>

export interface DynamicItemContext {
  value: Ref<string>
  isSelected: Ref<boolean>
  disabled: Ref<boolean | undefined>
  textId: string
}

export const [injectDynamicItemContext, provideDynamicItemContext]
  = createContext<DynamicItemContext>('DestylerDynamicItem')

export const DestylerDynamicItem = defineComponent({
  name: 'DestylerDynamicItem',
  props: destylerDynamicItemProps,
  setup(props) {
    const { value } = toRefs(props)

    const context = injectDynamicRootContext()
    const { forwardRef, currentElement } = useForwardExpose()
    const isSelected = computed(() => context.selectedElement.value === currentElement.value)

    const textId = useId()
    const disabled = computed(() => props.disabled || context.disabled.value)

    provideDynamicItemContext({
      value,
      isSelected,
      disabled,
      textId,
    })

    return {
      forwardRef,
      textId,
      isSelected,
      disabled,
    }
  },
  render() {
    return h(DestylerCollectionItem, {}, () => h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-labelledby': this.textId,
      'aria-current': this.isSelected,
      'data-disabled': this.disabled ? '' : undefined,
      'data-state': this.isSelected ? 'active' : 'inactive',
    }, () => this.$slots.default?.()))
  },
})
