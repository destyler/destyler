import { defineComponent, h } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'

export const destylerSelectPortalProps = {
  ...destylerTeleportProps,
}

export const DestylerSelectPortal = defineComponent({
  name: 'DestylerSelectPortal',
  props: destylerSelectPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, this.$slots.default?.())
  },
})
