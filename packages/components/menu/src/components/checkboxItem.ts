import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { CheckedState, ExtractPublicPropTypes } from '@destyler/shared'
import { useVModel } from '@destyler/composition'
import { getCheckedState, isIndeterminate } from '@destyler/shared'

import { DestylerMenuItem, destylerMenuItemProps } from './item'
import { provideMenuItemIndicatorContext } from './itemIndicator'

export const destylerMenuCheckBoxItemProps = {
  ...destylerMenuItemProps,
  checked: {
    type: [Boolean, String] as PropType<CheckedState>,
    required: false,
    default: false,
  },
} as const

export type DestylerMenuCheckBoxItemProps = ExtractPublicPropTypes<typeof destylerMenuCheckBoxItemProps>

export const DestylerMenuCheckboxItem = defineComponent({
  name: 'DestylerMenuCheckboxItem',
  props: destylerMenuCheckBoxItemProps,
  emits: ['update:checked', 'select'],
  setup(props, { emit }) {
    const checked = useVModel(props, 'checked', emit)

    provideMenuItemIndicatorContext({ checked })

    return {
      checked,
    }
  },
  render() {
    return h(DestylerMenuItem, mergeProps(this.$props, {
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
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
