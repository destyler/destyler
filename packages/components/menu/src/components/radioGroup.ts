import type { PropType, Ref } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useVModel } from '@destyler/composition'

import { DestylerMenuGroup, destylerMenuGroupProps } from './group'

export const destylerMenuRadioGroupProps = {
  ...destylerMenuGroupProps,
  modelValue: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
} as const

export type DestylerMenuRadioGroupProps = ExtractPublicPropTypes<typeof destylerMenuRadioGroupProps>

export interface MenuRadioGroupContext {
  modelValue: Ref<string>
  onValueChange: (payload: string) => void
}

export const [injectMenuRadioGroupContext, provideMenuRadioGroupContext] = createContext<MenuRadioGroupContext>('DestylerMenuRadioGroup')

export const DestylerMenuRadioGroup = defineComponent({
  name: 'DestylerMenuRadioGroup',
  props: destylerMenuRadioGroupProps,
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
    return h(DestylerMenuGroup, this.$props, this.$slots.default?.())
  },
})
