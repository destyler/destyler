import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { getCheckedState } from '@destyler/shared'

import { MenuItem, menuItemEmits, menuItemProps } from './item'
import { injectMenuRadioGroupContext } from './radioGroup'
import { provideMenuItemIndicatorContext } from './itemIndicator'

export const menuRadioItemProps = {
  ...menuItemProps,
  value: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type MenuRadioItemProps = ExtractPublicPropTypes<typeof menuRadioItemProps>

export const menuRadioItemEmits = {
  ...menuItemEmits,
}

export const MenuRadioItem = defineComponent({
  name: 'DestylerMenuRadioItem',
  props: menuRadioItemProps,
  emits: menuRadioItemEmits,
  setup(props) {
    const { value } = toRefs(props)
    const radioGroupContext = injectMenuRadioGroupContext()
    const checked = computed(
      () => radioGroupContext.modelValue.value === value?.value,
    )

    provideMenuItemIndicatorContext({ checked })

    return {
      value,
      radioGroupContext,
      checked,
    }
  },
  render() {
    return h(MenuItem, mergeProps(this.$props, {
      'role': 'menuitemradio',
      'aria-checked': this.checked,
      'data-state': getCheckedState(this.checked),
      'onSelect': async (event: any) => {
        this.$emit('select', event)
        this.radioGroupContext.onValueChange(this.value)
      },
    }), () => this.$slots.default?.())
  },
})
