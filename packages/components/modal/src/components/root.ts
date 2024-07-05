import type { PropType, Ref } from 'vue'
import { defineComponent, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId, useVModel } from '@destyler/composition'

export const modalRootProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type ModalRootProps = ExtractPublicPropTypes<typeof modalRootProps>

export interface ModalRootContext {
  open: Readonly<Ref<boolean>>
  openModal: () => void
  onOpenChange: (value: boolean) => void
  onOpenToggle: () => void
  triggerElement: Ref<HTMLElement | undefined>
  contentElement: Ref<HTMLElement | undefined>
  contentId: string
  titleId: string
  descriptionId: string
}

export const [injectModalRootContext, provideModalRootContext]
  = createContext<ModalRootContext>('DestylerModalRoot')

export const ModalRoot = defineComponent({
  name: 'DestylerModalRoot',
  props: modalRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const triggerElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()

    provideModalRootContext({
      open,
      openModal: () => {
        open.value = true
      },
      onOpenChange: (value) => {
        open.value = value
      },
      onOpenToggle: () => {
        open.value = !open.value
      },
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      triggerElement,
      contentElement,
    })
  },
  render() {
    return this.$slots.default?.()
  },
})
