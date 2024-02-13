import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusGroup } from '@destyler/roving-focus'

export const destylerToolbarRootProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'horizontal',
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerToolbarRootProps = ExtractPublicPropTypes<typeof destylerToolbarRootProps>

export interface ToolbarRootContext {
  orientation: Ref<DataOrientation>
  dir: Ref<Direction>
}

export const [injectToolbarRootContext, provideToolbarRootContext] = createContext<ToolbarRootContext>('DestylerToolbarRoot')

export const DestylerToolbarRoot = defineComponent({
  name: 'DestylerToolbarRoot',
  props: destylerToolbarRootProps,
  setup(props) {
    const { orientation, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const { forwardRef } = useForwardExpose()

    provideToolbarRootContext({ orientation, dir })

    return {
      orientation,
      dir,
      forwardRef,
    }
  },
  render() {
    return h(DestylerRovingFocusGroup, {
      asChild: true,
      orientation: this.orientation,
      dir: this.dir,
      loop: this.loop,
    }, {
      default: () => {
        return h(DestylerPrimitive, {
          'ref': (el: any) => this.forwardRef(el),
          'role': 'toolbar',
          'aria-orientation': this.orientation,
          'asChild': this.$props.asChild,
          'as': this.$props.as,
        }, {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
