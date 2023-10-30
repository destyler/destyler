import type { PropType } from 'vue'
import { defineComponent, h, ref, withDirectives } from 'vue'
import { zindexable } from '@destyler/directives'
import { useMemo } from '@destyler/composition'
import { DestylerLazyTeleport } from '@destyler/lazy-teleport'

export default defineComponent({
  name: 'DestylerFollower',
  props: {
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    enabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    to: {
      type: [String, Object] as PropType<string | HTMLElement>,
      default: 'body',
    },
    flip: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    internalShift: {
      type: Boolean as PropType<boolean>,
    },
    x: {
      type: Number as PropType<number>,
    },
    y: {
      type: Number as PropType<number>,
    },
    width: {
      type: String as PropType<'target' | string>,
    },
    minWidth: {
      type: String as PropType<'target' | string>,
    },
    containerClass: {
      type: String as PropType<string>,
    },
    teleportDisabled: {
      type: Boolean as PropType<boolean>,
    },
    zindexable: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    zIndex: {
      type: Number as PropType<number>,
    },
    overlap: {
      type: Boolean as PropType<boolean>,
    },
  },
  setup(props, { slots }) {
    const mergedEnabled = useMemo(() => {
      return props.enabled !== undefined ? props.enabled : props.show
    })
    const follower = ref<HTMLElement | null>(null)
    const offsetContainer = ref<HTMLElement | null>(null)

    return () => {
      return h(DestylerLazyTeleport, {
        to: props.to,
        disabled: props.teleportDisabled,
        show: props.show,
      }, {
        default: () => {
          const vNode = h('div', {
            ref: offsetContainer,
          }, [
            h('div', {
              ref: follower,
            }, slots.default?.()),
          ])
          if (props.zindexable) {
            return withDirectives(vNode, [
              [
                zindexable,
                {
                  enabled: mergedEnabled.value,
                  zIndex: props.zIndex,
                },
              ],
            ])
          }
          return vNode
        },
      })
    }
  },
})
