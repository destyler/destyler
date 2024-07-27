import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { MenuSub, menuSubProps } from '@destyler/menu'
import { menuSubEmits } from '@destyler/menu/component'

export const dropdownSubProps = {
  ...menuSubProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DropdownSubProps = ExtractPublicPropTypes<typeof dropdownSubProps>

export const dropdownSubEmits = {
  ...menuSubEmits,
}

export const DropdownSub = defineComponent({
  name: 'DestylerDropdownSub',
  props: dropdownSubProps,
  emits: dropdownSubEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const open = useVModel(props, 'open', emit, {
      passive: (props.open === undefined) as false,
      defaultValue: props.defaultOpen ?? false,
    })

    useForwardExpose()

    return {
      open,
    }
  },
  render() {
    return h(MenuSub, {
      'open': this.open,
      'onUpdate:open': (value: boolean) => {
        this.open = value
      },
    }, () => this.$slots.default?.())
  },
})
