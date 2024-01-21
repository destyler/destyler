import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerTeleport } from '@destyler/teleport'

export const destylerModalPortalProps = {
  ...destylerPrimitiveProps,
}

export const DestylerModalPortal = defineComponent({
  name: 'DestylerModalPortal',
  props: destylerModalPortalProps,
  render() {
    return h(DestylerTeleport, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, this.$slots.default?.())
  },
})
