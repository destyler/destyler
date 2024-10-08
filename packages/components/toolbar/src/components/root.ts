import type { PropType, Ref } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose } from '@destyler/composition'
import { RovingFocusGroup } from '@destyler/roving-focus'

export const toolbarRootProps = {
  ...primitiveProps,
  /**
   * The orientation of the toolbar
   * @default horizontal
   */
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'horizontal',
  },
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * When `true`, keyboard navigation will loop from last tab to first, and vice versa.
   */
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ToolbarRootProps = ExtractPublicPropTypes<typeof toolbarRootProps>

export interface ToolbarRootContext {
  orientation: Ref<DataOrientation>
  dir: Ref<Direction>
}

export const [injectToolbarRootContext, provideToolbarRootContext] = createContext<ToolbarRootContext>('DestylerToolbarRoot')

export const ToolbarRoot = defineComponent({
  name: 'DestylerToolbarRoot',
  props: toolbarRootProps,
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
    return h(RovingFocusGroup, {
      asChild: true,
      orientation: this.orientation,
      dir: this.dir,
      loop: this.loop,
    }, {
      default: () => {
        return h(Primitive, {
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
