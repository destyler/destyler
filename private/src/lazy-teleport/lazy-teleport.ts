import type { PropType } from 'vue'
import { Teleport, computed, defineComponent, h, toRef } from 'vue'
import { getSlot } from '@destyler/shared'
import { useFalseUntilTruthy } from '@destyler/composition'

const DestylerLazyTeleport = defineComponent({
  name: 'DestylerLazyTeleport',
  props: {
    to: {
      type: [String, Object] as PropType<string | HTMLElement>,
      default: 'body',
    },
    disabled: {
      type: Boolean as PropType<boolean>,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    return {
      showTeleport: useFalseUntilTruthy(toRef(props, 'show')),
      mergedTo: computed(() => {
        const { to } = props
        return to ?? 'body'
      }),
    }
  },
  render() {
    return this.showTeleport
      ? this.disabled
        ? getSlot('lazy-teleport', this.$slots)
        : h(
          Teleport,
          {
            disabled: this.disabled,
            to: this.mergedTo,
          },
          getSlot('lazy-teleport', this.$slots),
        )
      : null
  },
})

export {
  DestylerLazyTeleport,
}
