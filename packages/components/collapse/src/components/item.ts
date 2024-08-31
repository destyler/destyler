import type { ComputedRef, PropType, SlotsType, VNode, VNodeRef } from 'vue'
import { computed, defineComponent, h, withKeys } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useArrowNavigation, useForwardExpose, useId } from '@destyler/composition'
import { CollapsibleRoot } from '@destyler/collapsible'

import { primitiveProps } from '@destyler/primitive'
import { injectCollapseRootContext } from './root'

enum CollapseItemState {
  Open = 'open',
  Closed = 'closed',
}

export interface CollapseItemContext {
  open: ComputedRef<boolean>
  dataState: ComputedRef<CollapseItemState>
  disabled: ComputedRef<boolean>
  dataDisabled: ComputedRef<'' | undefined>
  triggerId: string
  currentRef: VNodeRef
  currentElement: ComputedRef<HTMLElement | undefined>
  value: ComputedRef<string>
}

export const [injectCollapseItemContext, provideCollapseItemContext] = createContext<CollapseItemContext>('DestylerCollapseItem')

export const collapseItemProps = {
  asChild: {
    ...primitiveProps.asChild,
  },
  /**
   * A string value for the accordion item. All items within an accordion should use a unique value.
   *
   * @default -
   */
  value: {
    type: String as PropType<string>,
    required: true,
  },
  /**
   * Whether or not an accordion item is disabled from user interaction.
   *
   * When `true`, prevents the user from interacting with the item.
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type CollapseItemProps = ExtractPublicPropTypes<typeof collapseItemProps>

export const CollapseItem = defineComponent({
  name: 'DestylerCollapseItem',
  props: collapseItemProps,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * Current open state
       */
      open: boolean
    }) => VNode[]
  }>,
  setup(props) {
    const rootContext = injectCollapseRootContext()

    const open = computed(() => {
      return rootContext.isSingle.value
        ? props.value === rootContext.modelValue.value
        : Array.isArray(rootContext.modelValue.value)
        && rootContext.modelValue.value.includes(props.value!)
    })

    const disabled = computed(() => {
      return (
        rootContext.disabled.value
        || props.disabled
        || (rootContext.isSingle.value && open.value && !rootContext.collapsible)
      )
    })

    const dataDisabled = computed(() => (disabled.value ? '' : undefined))

    const dataState = computed(() =>
      open.value ? CollapseItemState.Open : CollapseItemState.Closed,
    )

    const { currentRef, currentElement } = useForwardExpose()

    provideCollapseItemContext({
      open,
      dataState,
      disabled,
      dataDisabled,
      triggerId: useId(),
      currentRef,
      currentElement,
      value: computed(() => props.value!),
    })

    function handleArrowKey(e: KeyboardEvent) {
      useArrowNavigation(
        e,
        currentElement.value,
        rootContext.parentElement.value!,
        {
          arrowKeyOptions: rootContext.orientation,
          dir: rootContext.direction.value,
          focus: true,
        },
      )
    }

    return {
      open,
      rootContext,
      dataDisabled,
      dataState,
      disabled,
      handleArrowKey,
    }
  },
  render() {
    return h(CollapsibleRoot, {
      'data-orientation': this.rootContext.orientation,
      'data-disabled': this.dataDisabled,
      'data-state': this.dataState,
      'disabled': this.disabled,
      'open': this.open,
      'asChild': this.$props.asChild,
      'onKeydown': withKeys((event: any) => {
        this.handleArrowKey(event)
      }, ['up', 'down', 'left', 'right', 'home', 'end']),
    }, () => this.$slots.default?.({ open: this.open }))
  },
})
