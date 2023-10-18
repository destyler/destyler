import { Transition, defineComponent, h } from 'vue'
import { useIsMounted } from '@destyler/composition'

export default defineComponent({
  name: 'BaseIconSwitchTransition',
  setup(_, { slots }) {
    const isMountedRef = useIsMounted()
    return () => {
      return h(Transition, {
        name: 'icon-switch-transition',
        appear: isMountedRef.value,
      }, slots)
    }
  },
})
