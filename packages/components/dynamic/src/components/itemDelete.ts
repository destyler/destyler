import { computed, defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDynamicRootContext } from './root'
import { injectDynamicItemContext } from './item'

export const dynamicItemDeleteProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type DynamicItemDeleteProps = ExtractPublicPropTypes<typeof dynamicItemDeleteProps>

export const DynamicItemDelete = defineComponent({
  name: 'DestylerDynamicItemDelete',
  props: dynamicItemDeleteProps,
  setup() {
    useForwardExpose()
    const context = injectDynamicRootContext()
    const itemContext = injectDynamicItemContext()

    const disabled = computed(() => itemContext.disabled?.value || context.disabled.value)

    function handleDelete() {
      if (disabled.value)
        return
      const index = context.modelValue.value.findIndex(i => i === itemContext.value.value)
      context.onRemoveValue(index)
    }

    return {
      context,
      itemContext,
      disabled,
      handleDelete,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'tabindex': '-1',
      'aria-labelledby': this.itemContext.textId,
      'aria-current': this.itemContext.isSelected.value,
      'data-state': this.itemContext.isSelected.value ? 'active' : 'inactive',
      'data-disabled': this.disabled ? '' : undefined,
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'onClick': () => {
        this.handleDelete()
      },
    }), () => this.$slots.default?.())
  },
})
