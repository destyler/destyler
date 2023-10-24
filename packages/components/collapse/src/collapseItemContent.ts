import type { PropType } from 'vue'
import { defineComponent, h, toRef, vShow, withDirectives } from 'vue'
import { useFalseUntilTruthy } from '@destyler/composition'
import { FadeInExpandTransition } from '@destyler/shared'

export default defineComponent({
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
  setup(props, { slots }) {
    const onceTrue = useFalseUntilTruthy(toRef(props, 'show'))

    return () => {
      const useVShow = props.displayDirective === 'show' && onceTrue
      const contentNode = h('div', null, slots)
      return h(FadeInExpandTransition, {}, [
        useVShow
          ? withDirectives(contentNode, [[vShow, props.show]])
          : props.show
            ? contentNode
            : null,
      ])
    }
  },
})
