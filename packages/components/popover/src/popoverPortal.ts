import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'

export const destylerPopoverPortalProps = {
  ...destylerTeleportProps,
}

export const DestylerPopoverPortal = defineComponent({
  name: 'DestylerPopoverPortal',
  props: destylerPopoverPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), this.$slots.default?.())
  },
})
