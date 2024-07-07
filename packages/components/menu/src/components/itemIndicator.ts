import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { CheckedState, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext, isIndeterminate } from '@destyler/shared'
import { Presence } from '@destyler/presence'
import { Primitive, primitiveProps } from '@destyler/primitive'

import { getCheckedState } from '../utils'

export const menuItemIndicatorProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenuItemIndicatorProps = ExtractPublicPropTypes<typeof menuItemIndicatorProps>

export interface MenuItemIndicatorContext {
  checked: Ref<CheckedState>
}

export const [injectMenuItemIndicatorContext, provideMenuItemIndicatorContext] = createContext<MenuItemIndicatorContext>(['DestylerMenuCheckboxItem', 'DestylerMenuRadioItem'], 'DestylerMenuItemIndicatorContext')

export const MenuItemIndicator = defineComponent({
  name: 'DestylerMenuItemIndicator',
  props: menuItemIndicatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const indicatorContext = injectMenuItemIndicatorContext({
      checked: ref(false),
    })

    return {
      indicatorContext,
    }
  },
  render() {
    return h(Presence, {
      present: this.$props.forceMount || isIndeterminate(this.indicatorContext.checked.value) || this.indicatorContext.checked.value === true,
    }, () => h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': getCheckedState(this.indicatorContext.checked.value),
    }, () => this.$slots.default?.()))
  },
})
