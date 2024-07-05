import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { MenuSub, menuSubProps } from '@destyler/menu'

export const menubarSubProps = {
  ...menuSubProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenubarSubProps = ExtractPublicPropTypes<typeof menubarSubProps>

export const MenubarSub = defineComponent({
  name: 'DestylerMenubarSub',
  props: menubarSubProps,
  emits: ['update:open'],
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
