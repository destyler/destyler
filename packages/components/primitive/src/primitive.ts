import { type Component, type PropType, defineComponent, h } from 'vue'
import { DestylerSlot } from './slot'

type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | ({} & string) // any other string

interface DestylerPrimitiveProps {
  /**
   * Setting "asChild" to true has the same effect as setting "as" to "template".
   * @default false
   */
  asChild?: boolean
  /**
   * @default "div"
   */
  as?: AsTag | Component
}

const DestylerPrimitive = defineComponent({
  name: 'DestylerPrimitive',
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
    as: {
      type: [String, Object] as PropType<AsTag | Component>,
      default: 'div',
    },
  },
  setup(props, { attrs, slots }) {
    const asTag = props.asChild ? 'template' : props.as

    if (asTag !== 'template')
      return () => h(props.as, attrs, { default: slots.default })

    return () => h(DestylerSlot, attrs, { default: slots.default })
  },
})

export {
  AsTag,
  DestylerPrimitiveProps,
  DestylerPrimitive,
}
