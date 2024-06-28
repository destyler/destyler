import type { PropType, Ref } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useVModel } from '@destyler/composition'

import { MenuGroup, menuGroupProps } from './group'

export const menuRadioGroupProps = {
  ...menuGroupProps,
  modelValue: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
} as const

export type MenuRadioGroupProps = ExtractPublicPropTypes<typeof menuRadioGroupProps>

export interface MenuRadioGroupContext {
  modelValue: Ref<string>
  onValueChange: (payload: string) => void
}

export const [injectMenuRadioGroupContext, provideMenuRadioGroupContext] = createContext<MenuRadioGroupContext>('DestylerMenuRadioGroup')

export const MenuRadioGroup = defineComponent({
  name: 'DestylerMenuRadioGroup',
  props: menuRadioGroupProps,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const modelValue = useVModel(props, 'modelValue', emit)

    provideMenuRadioGroupContext({
      modelValue,
      onValueChange: (payload) => {
        modelValue.value = payload
      },
    })
  },
  render() {
    return h(MenuGroup, this.$props, () => this.$slots.default?.())
  },
})
