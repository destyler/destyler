import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuItem, destylerMenuItemProps } from '@destyler/menu'

export const destylerMenubarItemProps = {
  ...destylerMenuItemProps,
} as const

export type DestylerMenubarItemProps = ExtractPublicPropTypes<typeof destylerMenubarItemProps>

export const DestylerMenubarItem = defineComponent({
  name: 'DestylerMenubarItem',
  props: destylerMenubarItemProps,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuItem, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
