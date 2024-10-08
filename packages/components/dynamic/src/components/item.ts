import { computed, defineComponent, h, toRefs } from 'vue'
import type { PropType, Ref } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useId } from '@destyler/composition'
import { createContext } from '@destyler/shared'
import { CollectionItem } from '@destyler/collection'

import { injectDynamicRootContext } from './root'

export const dynamicItemProps = {
  ...primitiveProps,
  /**
   * Value associated with the tags
   */
  value: {
    type: String as PropType<string>,
    required: true,
  },
  /**
   * When `true`, prevents the user from interacting with the tags input.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DynamicItemProops = ExtractPublicPropTypes<typeof dynamicItemProps>

export interface DynamicItemContext {
  value: Ref<string>
  isSelected: Ref<boolean>
  disabled: Ref<boolean | undefined>
  textId: string
}

export const [injectDynamicItemContext, provideDynamicItemContext]
  = createContext<DynamicItemContext>('DestylerDynamicItem')

export const DynamicItem = defineComponent({
  name: 'DestylerDynamicItem',
  props: dynamicItemProps,
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
    return h(CollectionItem, {}, () => h(Primitive, {
      'ref': this.forwardRef,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-labelledby': this.textId,
      'aria-current': this.isSelected,
      'data-disabled': this.disabled ? '' : undefined,
      'data-state': this.isSelected ? 'active' : 'inactive',
    }, () => this.$slots.default?.()))
  },
})
