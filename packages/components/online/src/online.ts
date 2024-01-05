import type { PropType } from 'vue'
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { Ping } from './ping'

const DestylerOnline = defineComponent({
  name: 'DestylerOnline',
  props: {
    url: {
      type: String as PropType<string>,
      required: false,
      default: 'https://google.com',
    },
    favicon: {
      type: String as PropType<string>,
      required: false,
      default: '/favicon.ico',
    },
    timeout: {
      type: Number as PropType<number>,
      required: false,
      default: 0,
    },
    logError: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
  emits: ['networkStatus'],
  setup(props, { emit }) {
    const isOnline = ref<boolean>(navigator.onLine || false)
    const events = ref<string[]>(['online', 'offline', 'load'])
    const url = ref<string>(props.url || 'https://google.com')

    onMounted(() => {
      events.value.forEach(event => window.addEventListener(event, status))
    })

    onBeforeUnmount(() => {
      events.value.forEach(event =>
        window.removeEventListener(event, status),
      )
    })

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
  },
  render() {
    return h('div', {
      destyler: 'online',
    }, this.$slots.default?.())
  },
})

export {
  DestylerOnline,
}
