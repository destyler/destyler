import type { ComputedRef, PropType, VNodeRef } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { createContext } from '@destyler/shared'
import { useArrowNavigation, useCustomElement, useId } from '@destyler/composition'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerCollapsibleRoot } from '@destyler/collapsible'
import { injectCollapseRootContext } from './collapseRoot'

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
  customElement: VNodeRef
  currentElement: ComputedRef<HTMLElement | undefined>
  value: ComputedRef<string>
}

export const [injectCollapseItemContext, provideCollapseItemContext] = createContext<CollapseItemContext>('DestylerCollapseItem')

export const destylerCollapseItemProps = {
  ...destylerPrimitiveProps,
  value: {
    type: String as PropType<string>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const DestylerCollapseItem = defineComponent({
  name: 'DestylerCollapseItem',
  props: destylerCollapseItemProps,
  setup(props) {
    const rootContext = injectCollapseRootContext()

    const open = computed(() =>
      rootContext.isSingle.value
        ? props.value === rootContext.modelValue.value
        : Array.isArray(rootContext.modelValue.value)
        && rootContext.modelValue.value.includes(props.value!),
    )

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

    const { customElement, currentElement } = useCustomElement()

    provideCollapseItemContext({
      open,
      dataState,
      disabled,
      dataDisabled,
      triggerId: useId(),
      customElement,
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
    return h(DestylerCollapsibleRoot, {
      'data-orientation': this.rootContext.orientation,
      'data-disabled': this.dataDisabled,
      'data-state': this.dataState,
      'disabled': this.disabled,
      'open': this.open,
      'asChild': this.$props.asChild,
      'onKeyDownUpDownLeftRightHomeEnd': this.handleArrowKey,
    }, this.$slots.default?.({ open: this.open }))
  },
})
