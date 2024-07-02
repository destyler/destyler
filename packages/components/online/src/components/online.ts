import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, onBeforeUnmount, onMounted, ref } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { Ping } from '../ping'

export const onlineProps = {
  ...primitiveProps,
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
} as const

export type OnlineProps = ExtractPublicPropTypes<typeof onlineProps>

export const Online = defineComponent({
  name: 'DestylerOnline',
  inheritAttrs: false,
  props: onlineProps,
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
    return h(Primitive, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
