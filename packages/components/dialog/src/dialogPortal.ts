import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerTeleport } from '@destyler/teleport'

export const destylerDialogPortalProps = {
  ...destylerPrimitiveProps,
}

export const DestylerDialogPortal = defineComponent({
  name: 'DestylerDialogPortal',
  props: destylerDialogPortalProps,
  render() {
    return h(DestylerTeleport, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, this.$slots.default?.())
  },
})
