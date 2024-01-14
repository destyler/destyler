import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, onBeforeUnmount, onMounted,ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { Ping } from './ping'

const DestylerOnline = defineComponent({
  name: 'DestylerOnline',
  inheritAttrs: false,
  props: {
    ...destylerPrimitiveProps,
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
    onMounted(() => {
      const isOnline = ref<boolean>(navigator.onLine || false)
      const events = ref<string[]>(['online', 'offline', 'load'])
      const url = ref<string>(props.url || 'https://google.com')
      events.value.forEach((event) => {
        window.addEventListener(event, status)
      })

      onBeforeUnmount(() => {
        events.value.forEach(event =>
          window.removeEventListener(event, status),
        )
      })

      async function status(): Promise<void> {
        const p = new Ping({
          favicon: props.favicon,
          timeout: props.timeout,
          logError: props.logError,
        })
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

      status()
    })
  },
  render() {
    return h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      ...mergeProps(this.$attrs),
    }, this.$slots.default?.())
  },
})

export {
  DestylerOnline,
}
