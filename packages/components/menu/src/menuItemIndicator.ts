import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { CheckedState, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext, isIndeterminate } from '@destyler/shared'
import { DestylerPresence } from '@destyler/presence'
import { DestylerPrimitive } from '@destyler/primitive'

import { getCheckedState } from './utils'

export const destylerMenuItemIndicatorProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerMenuItemIndicatorProps = ExtractPublicPropTypes<typeof destylerMenuItemIndicatorProps>

export interface MenuItemIndicatorContext {
  checked: Ref<CheckedState>
}

export const [injectMenuItemIndicatorContext, provideMenuItemIndicatorContext] = createContext<MenuItemIndicatorContext>(['DestylerMenuCheckboxItem', 'DestylerMenuRadioItem'], 'DestylerMenuItemIndicatorContext')

export const DestylerMenuItemIndicator = defineComponent({
  name: 'DestylerMenuItemIndicator',
  props: destylerMenuItemIndicatorProps,
  setup() {
    const indicatorContext = injectMenuItemIndicatorContext({
      checked: ref(false),
    })

    return {
      indicatorContext,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || isIndeterminate(this.indicatorContext.checked.value) || this.indicatorContext.checked.value === true,
    }, h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': getCheckedState(this.indicatorContext.checked.value),
    }, this.$slots.default?.()))
  },
})
