import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { CheckedState, ExtractPublicPropTypes } from '@destyler/shared'
import { useVModel } from '@destyler/composition'
import { getCheckedState, isIndeterminate } from '@destyler/shared'

import { MenuItem, menuItemEmits, menuItemProps } from './item'
import { provideMenuItemIndicatorContext } from './itemIndicator'

export const menuCheckboxItemProps = {
  ...menuItemProps,
  checked: {
    type: [Boolean, String] as PropType<CheckedState>,
    required: false,
    default: false,
  },
} as const

export type MenuCheckboxItemProps = ExtractPublicPropTypes<typeof menuCheckboxItemProps>

export const menuCheckboxItemEmits = {
  ...menuItemEmits,
  'update:checked': (_checked: CheckedState) => true,
}

export const MenuCheckboxItem = defineComponent({
  name: 'DestylerMenuCheckboxItem',
  props: menuCheckboxItemProps,
  emits: menuCheckboxItemEmits,
  setup(props, { emit }) {
    const checked = useVModel(props, 'checked', emit)

    provideMenuItemIndicatorContext({ checked })

    return {
      checked,
    }
  },
  render() {
    return h(MenuItem, mergeProps(this.$props, {
      'role': 'menuitemcheckbox',
      'aria-checked': isIndeterminate(this.checked) ? 'mixed' : this.checked,
      'data-state': getCheckedState(this.checked),
      'onSelect': async (event: any) => {
        this.$emit('select', event)
        if (isIndeterminate(this.checked))
          this.checked = true
        else
          this.checked = !this.checked
      },
    }), () => this.$slots.default?.())
  },
})
