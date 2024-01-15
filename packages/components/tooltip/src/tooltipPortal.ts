import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'

export const destylerTooltipPortalProps = {
  ...destylerTeleportProps,
}

export const DestylerTooltipPortal = defineComponent({
  name: 'DestylerTooltipPortal',
  props: destylerTooltipPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), this.$slots.default?.())
  },
})
