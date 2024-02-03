import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRef } from 'vue'
import { DestylerPopperRoot } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId, useVModel } from '@destyler/composition'

export interface PopoverRootContext {
  triggerElement: Ref<HTMLElement | undefined>
  contentId: string
  open: Ref<boolean>
  modal: Ref<boolean>
  onOpenChange(value: boolean): void
  onOpenToggle(): void
  hasCustomAnchor: Ref<boolean>
}

export const [injectPopoverRootContext, providePopoverRootContext] = createContext<PopoverRootContext>('DestylerPopoverRoot')

export const destylerPopoverRootProps = {
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  open: {
    type: Boolean as PropType<boolean | undefined>,
    required: false,
    default: undefined,
  },
  modal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerPopoverRootProps = ExtractPublicPropTypes<typeof destylerPopoverRootProps>

export const DestylerPopoverRoot = defineComponent({
  name: 'DestylerPopoverRoot',
  props: destylerPopoverRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const modalRef = toRef(props.modal)

    const openRef = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const triggerElement = ref<HTMLElement>()
    const hasCustomAnchor = ref(false)

    function handleUpdateOpen(value: boolean) {
      openRef.value = value
    }

    providePopoverRootContext({
      contentId: useId(),
      modal: modalRef,
      open: openRef,
      onOpenChange: (value) => {
        handleUpdateOpen(value)
      },
      onOpenToggle: () => {
        handleUpdateOpen(!openRef.value)
      },
      triggerElement,
      hasCustomAnchor,
    })

    return {
      openRef,
      modalRef,
      triggerElement,
      hasCustomAnchor,
    }
  },
  render() {
    return h(DestylerPopperRoot, null, {
      default: () => this.$slots.default?.(),
    })
  },
})
