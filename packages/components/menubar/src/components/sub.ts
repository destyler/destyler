import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { MenuSub, menuSubProps } from '@destyler/menu'
import { menuSubEmits } from '@destyler/menu/component'

export const menubarSubProps = {
  ...menuSubProps,
  /**
   * The open state of the submenu when it is initially rendered. Use when you do not need to control its open state.
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenubarSubProps = ExtractPublicPropTypes<typeof menubarSubProps>

export const menubarSubEmits = {
  ...menuSubEmits,
}

export const MenubarSub = defineComponent({
  name: 'DestylerMenubarSub',
  props: menubarSubProps,
  emits: menubarSubEmits,
  setup(props, { emit }) {
    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen ?? false,
      passive: (props.open === undefined) as false,
    })

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
