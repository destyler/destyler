import type { PropType } from 'vue'
import { defineComponent, h, ref, withDirectives } from 'vue'
import { zindexable } from '@destyler/directives'
import { useIsMounted, useMemo } from '@destyler/composition'
import { DestylerLazyTeleport } from '@destyler/lazy-teleport'

export interface FollowerInst {
  syncPosition: () => void
}

export default defineComponent({
  name: 'DestylerFollower',
  props: {
    show: Boolean,
    enabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    to: {
      type: [String, Object] as PropType<string | HTMLElement>,
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

    const isMounted = useIsMounted()

    const mergedTo = useMemo<string | HTMLElement | undefined>(
      (): HTMLElement | string | undefined => {
        const { to } = props
        if (to !== undefined)
          return to
        if (isMounted.value) {
          // TODO: find proper container
          return undefined
        }
        return undefined
      },
    )

    return () => {
      return h(DestylerLazyTeleport, {
        show: props.show,
        to: mergedTo.value,
        disabled: props.teleportDisabled,
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
