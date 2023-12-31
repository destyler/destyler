import type { PropType } from 'vue'
import { defineComponent, h, toRef, vShow, withDirectives } from 'vue'
import { useFalseUntilTruthy } from '@destyler/composition'
import { FadeInExpandTransition } from '@destyler/shared'

const DestylerCollapseItemContent = defineComponent({
  name: 'DestylerCollapseItemContent',
  props: {
    displayDirective: {
      type: String as PropType<'if' | 'show'>,
      required: true,
    },
    show: {
      type: Boolean as PropType<boolean>,
    },
  },
  setup(props) {
    const onceTrue = useFalseUntilTruthy(toRef(props, 'show'))

    return {
      onceTrue,
    }
  },
  render() {
    const useVShow = this.$props.displayDirective === 'show' && this.onceTrue
    const contentNode = h('div', { destyler: 'collapse-item-content' }, this.$slots)
    return h(FadeInExpandTransition, {
      destyler: 'collapse-item-content-wrapper',
    }, [
      useVShow
        ? withDirectives(contentNode, [[vShow, this.$props.show]])
        : this.$props.show
          ? contentNode
          : null,
    ])
  },
})

export {
  DestylerCollapseItemContent,
}
