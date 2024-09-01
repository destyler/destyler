import type { PropType } from 'vue'
import { computed, defineComponent, h, onMounted, ref, withDirectives } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'

import { makeContentId, makeTriggerId } from '../utils'
import { injectTabsRootContext } from './root'

export const tabsContentProps = {
  ...primitiveProps,
  /**
   * A unique value that associates the content with a trigger.
   */
  value: {
    type: String as PropType<string>,
    required: true,
  },
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type TabsContentProps = ExtractPublicPropTypes<typeof tabsContentProps>

export const TabsContent = defineComponent({
  name: 'DestylerTabsContent',
  props: tabsContentProps,
  setup(props) {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectTabsRootContext()
    const triggerId = computed(() =>
      makeTriggerId(rootContext.baseId, props.value),
    )
    const contentId = computed(() =>
      makeContentId(rootContext.baseId, props.value),
    )

    const isSelected = computed(
      () => props.value === rootContext.modelValue.value,
    )
    const isMountAnimationPreventedRef = ref(isSelected.value)

    onMounted(() => {
      requestAnimationFrame(() => {
        isMountAnimationPreventedRef.value = false
      })
    })

    return {
      forwardRef,
      rootContext,
      triggerId,
      contentId,
      isSelected,
      isMountAnimationPreventedRef,
    }
  },
  render() {
    return h(
      Presence,
      {
        present: this.isSelected,
        forceMount: false,
      },
      {
        default: ({ present }: any) => [
          withDirectives(
            h(
              Primitive,
              {
                'ref': (el: any) => this.forwardRef(el),
                'as': this.$props.as,
                'asChild': this.$props.asChild,
                'role': 'tabpanel',
                'data-state': this.isSelected ? 'active' : 'inactive',
                'data-orientation': this.rootContext.orientation.value,
                'aria-labelledby': this.triggerId,
                'hidden': !present.value,
                'tabindex': '0',
                'style': {
                  animationDuration: this.isMountAnimationPreventedRef
                    ? '0s'
                    : undefined,
                },
              },
              () => [
                this.$props.forceMount || this.isSelected
                  ? this.$slots.default?.()
                  : null,
              ],
            ),
            [[BindOnceDirective, { id: this.contentId }]],
          ),
        ],
      },
    )
  },
})
