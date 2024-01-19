import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'

export const destylerModalTeleportProps = {
  ...destylerTeleportProps,
}

export const DestylerModalPortal = defineComponent({
  name: 'DestylerModalPortal',
  props: destylerModalTeleportProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), this.$slots.default?.())
  },
})
