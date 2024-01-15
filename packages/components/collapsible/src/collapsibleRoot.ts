import type { PropType, Ref } from 'vue'
import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { createContext } from '@destyler/shared'
import { useId, useVModel } from '@destyler/composition'

export interface CollapsibleRootContext {
  contentId: string
  disabled: Ref<boolean | undefined>
  open: Ref<boolean>
  onOpenToggle(): void
}

export const [injectCollapsibleRootContext, provideCollapsibleRootContext]
  = createContext<CollapsibleRootContext>('DestylerCollapsibleRoot')

export const destylerCollapsibleRootProps = {
  ...destylerPrimitiveProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
  },
}

export const DestylerCollapsibleRoot = defineComponent({
  name: 'DestylerCollapsibleRoot',
  props: destylerCollapsibleRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const disabled = useVModel(props, 'disabled')

    provideCollapsibleRootContext({
      contentId: useId(),
      disabled,
      open,
      onOpenToggle: () => {
        open.value = !open.value
      },
    })

    return {
      open,
      disabled,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.$props.open ? 'open' : 'closed',
      'data-disabled': this.$props.disabled ? '' : undefined,
    }, this.$slots.default?.({ open: this.open }))
  },
})
