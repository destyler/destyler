import type { PropType } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { RovingFocusGroup } from '@destyler/roving-focus'
import { Primitive, primitiveProps } from '@destyler/primitive'

import { injectTabsRootContext } from './root'

export const tabsListProps = {
  ...primitiveProps,
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type TabsListProps = ExtractPublicPropTypes<typeof tabsListProps>

export const TabsList = defineComponent({
  name: 'DestylerTabsList',
  props: tabsListProps,

  setup(props) {
    const { loop } = toRefs(props)

    const { forwardRef, currentElement } = useForwardExpose()
    const context = injectTabsRootContext()

    context.tabsList = currentElement

    return {
      forwardRef,
      loop,
      context,
    }
  },
  render() {
    return h(RovingFocusGroup, {
      asChild: true,
      loop: this.loop,
      dir: this.context.dir.value,
      orientation: this.context.orientation.value,
    }, () => h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'role': 'tablist',
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'aria-orientation': this.context.orientation.value,
    }, {
      default: () => this.$slots.default?.(),
    }))
  },
})
