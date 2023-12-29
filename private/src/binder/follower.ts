import type { PropType } from 'vue'
import { defineComponent, h, inject, ref, withDirectives } from 'vue'
import { zindexable } from '@destyler/directives'
import { useIsMounted, useMemo } from '@destyler/composition'
import { DestylerLazyTeleport } from '../lazy-teleport/lazy-teleport'
import type { BinderInstance } from './instance'

const DestylerFollower: any = defineComponent({
  name: 'DestylerFollower',
  inheritAttrs: true,
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
  setup(props) {
    const DestylerBinder = inject<BinderInstance>('DestylerBinder')!
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

    function getElementBounding(): { x: number, y: number, width: number, height: number } {
      if (DestylerBinder.targetRef === null) {
        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        }
      }
      else {
        const rect = DestylerBinder.targetRef.getBoundingClientRect()
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        }
      }
    }

    return {
      mergedEnabled,
      follower,
      offsetContainer,
      mergedTo,
      getElementBounding,
    }
  },
  render() {
    return h(DestylerLazyTeleport, {
      to: this.mergedTo,
      disabled: this.$props.teleportDisabled,
      show: this.$props.show,
    }, {
      default: () => {
        const vNode = h('div', {
          ref: 'offsetContainer',
          destyler: 'offset-container',
        }, [
          h('div', {
            ref: 'follower',
            destyler: 'follower',
            style: `
            --destyler-follower-x:${this.getElementBounding().x}px;
            --destyler-follower-y:${this.getElementBounding().y}px;
            --destyler-follower-width:${this.getElementBounding().width}px;
            --destyler-follower-height:${this.getElementBounding().height}px;
            `,
          }, this.$slots.default?.()),
        ])
        if (this.$props.zindexable) {
          return withDirectives(vNode, [
            [
              zindexable,
              {
                enabled: this.mergedEnabled,
                zIndex: this.$props.zIndex,
              },
            ],
          ])
        }
        return vNode
      },
    })
  },
})

export default DestylerFollower
