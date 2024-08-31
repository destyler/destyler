import { computed, defineComponent, h, mergeProps, onBeforeUnmount, onMounted } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { TeleportPrimitive } from '@destyler/teleport'

import { injectSelectNativeOptionsContext, injectSelectRootContext } from './root'
import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'
import { injectSelectItemContext } from './item'

export const selectItemTextProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SelectItemTextProps = ExtractPublicPropTypes<typeof selectItemTextProps>

export const SelectItemText = defineComponent({
  name: 'DestylerSelectItemText',
  inheritAttrs: false,
  props: selectItemTextProps,

  setup() {
    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const nativeOptionContext = injectSelectNativeOptionsContext()
    const itemContext = injectSelectItemContext()

    const { forwardRef, currentElement: itemTextElement } = useForwardExpose()

    const nativeOption = computed(() => {
      return h('option', {
        key: itemContext.value,
        value: itemContext.value,
        disabled: itemContext.disabled.value,
        innerHTML: itemTextElement.value?.textContent,
      })
    })

    onMounted(() => {
      if (!itemTextElement.value)
        return
      itemContext.onItemTextChange(itemTextElement.value)
      contentContext.itemTextRefCallback(
        itemTextElement.value,
        itemContext.value,
        itemContext.disabled.value,
      )
      nativeOptionContext.onNativeOptionAdd(nativeOption.value)
    })

    onBeforeUnmount(() => {
      nativeOptionContext.onNativeOptionRemove(nativeOption.value)
    })

    return {
      forwardRef,
      itemContext,
      rootContext,
    }
  },
  render() {
    return [
      h(Primitive, mergeProps(
        {
          ...this.$props,
          ...this.$attrs,
        },
        {
          ref: this.forwardRef,
          id: this.itemContext.textId,
        },
      ), () => this.$slots.default?.()),
      this.itemContext.isSelected.value && this.rootContext.valueElement.value && !this.rootContext.valueElementHasChildren.value
        ? h(TeleportPrimitive, {
          to: this.rootContext.valueElement.value,
        }, this.$slots.default?.())
        : null,
    ]
  },
})
