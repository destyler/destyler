import type { PropType } from 'vue'
import { defineComponent, h, onBeforeUnmount, ref } from 'vue'
import Ping from './ping'

export default defineComponent({
  name: 'DestylerOnline',
  props: {
    url: {
      type: String as PropType<string>,
      required: false,
      default: 'https://google.com',
    },
  },
  emits: ['networkStatus'],
  setup(props, { emit, slots }) {
    // state
    const isOnline = ref<boolean>(navigator.onLine || false)
    const events = ref<string[]>(['online', 'offline', 'load'])
    const url = ref<string>(props.url || 'https://google.com')
    /**
     * Created lifecycle hook
     */
    events.value.forEach(event => window.addEventListener(event, status))

    /**
     * Before unmount lifecycle hook
     */
    onBeforeUnmount(() => {
      // Cleanup of the event listeners
      events.value.forEach(event =>
        window.removeEventListener(event, status),
      )
    })

    /**
     * Pings the URL and emits an
     * detected online/offline event.
     *
     * @returns {Promise<void>}
     */
    async function status(): Promise<void> {
      const p = new Ping()
      try {
        const ping = await p.ping(url.value)
        if (ping || navigator.onLine) {
          isOnline.value = true
          emit('networkStatus', isOnline.value)
        }
      }
      catch (error) {
        if (error || !navigator.onLine) {
          isOnline.value = false
          emit('networkStatus', isOnline.value)
        }
      }
    }

    return () => {
      return h('div', {
        destyler: 'online',
      }, slots.default?.())
    }
  },
})
