import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { getCheckedState } from '@destyler/shared'

import { DestylerMenuItem, destylerMenuItemProps } from './item'
import { injectMenuRadioGroupContext } from './radioGroup'
import { provideMenuItemIndicatorContext } from './itemIndicator'

export const destylerMenuRadioItemProps = {
  ...destylerMenuItemProps,
  value: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type DestylerMenuRadioItemProps = ExtractPublicPropTypes<typeof destylerMenuRadioItemProps>

export const DestylerMenuRadioItem = defineComponent({
  name: 'DestylerMenuRadioItem',
  props: destylerMenuRadioItemProps,
  emits: ['select'],
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
    return h(DestylerMenuItem, mergeProps(this.$props, {
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
