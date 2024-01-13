import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRef } from 'vue'
import { DestylerPopperRoot } from '@destyler/popper'
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
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  modal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const DestylerPopoverRoot = defineComponent({
  name: 'DestylerPopoverRoot',
  props: destylerPopoverRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const modalRef = toRef(props.modal)
    const openRef = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    })

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
      handleUpdateOpen,
    }
  },
  render() {
    return h(DestylerPopperRoot, this.$slots.default?.({ handleUpdateOpen: this.handleUpdateOpen }))
  },
})
