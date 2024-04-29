import type { Component, PropType } from 'vue'
import { Teleport, computed, defineComponent, h, mergeProps, onBeforeUnmount, onMounted, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectNativeOptionsContext, injectSelectRootContext } from './root'
import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'
import { injectSelectItemContext } from './item'

export const destylerSelectItemTextProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
} as const

export type DestylerSelectItemTextProps = ExtractPublicPropTypes<typeof destylerSelectItemTextProps>

export const DestylerSelectItemText = defineComponent({
  name: 'DestylerSelectItemText',
  inheritAttrs: false,
  props: destylerSelectItemTextProps,
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
        disabled: itemContext.disabled!.value,
        innerHTML: itemTextElement.value?.textContent,
      })
    })

    onMounted(() => {
      if (!itemTextElement.value)
        return
      itemContext.onItemTextChange(itemTextElement.value)
      contentContext.itemTextRefCallback(
        itemTextElement.value,
        itemContext.value!,
        itemContext.disabled!.value!,
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
      withDirectives(h(DestylerPrimitive, mergeProps(this.$props, this.$attrs, {
        ref: (el: any) => this.forwardRef(el),
      }), () => this.$slots.default?.()), [
        [BindOnceDirective, { id: this.itemContext.textId }],
      ]),
      this.itemContext.isSelected.value && this.rootContext.valueElement.value && !this.rootContext.valueElementHasChildren.value
        ? h(Teleport, {
          to: this.rootContext.valueElement.value,
        }, {
          default: () => {
            return this.$slots.default?.()
          },
        })
        : null,
    ]
  },
})
