import type { PropType, Ref } from 'vue'
import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useId, useVModel } from '@destyler/composition'

export interface CollapsibleRootContext {
  contentId: string
  disabled: Ref<boolean | undefined>
  open: Ref<boolean>
  onOpenToggle: () => void
}

export const [injectCollapsibleRootContext, provideCollapsibleRootContext]
  = createContext<CollapsibleRootContext>('DestylerCollapsibleRoot')

export const collapsibleRootProps = {
  ...primitiveProps,
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
} as const

export type CollapsibleRootProps = ExtractPublicPropTypes<typeof collapsibleRootProps>

export const collapsibleRootEmits = {
  'update:open': (_open: boolean) => true,
}

export const CollapsibleRoot = defineComponent({
  name: 'DestylerCollapsibleRoot',
  props: collapsibleRootProps,
  emits: collapsibleRootEmits,
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

    useForwardExpose()

    return {
      open,
      disabled,
    }
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.$props.open ? 'open' : 'closed',
      'data-disabled': this.$props.disabled ? '' : undefined,
    }, () => this.$slots.default?.({ open: this.open }))
  },
})
