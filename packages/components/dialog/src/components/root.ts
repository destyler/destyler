import type { PropType, Ref } from 'vue'
import { defineComponent, ref, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useVModel } from '@destyler/composition'

export const dialogRootProps = {
  /**
   * The controlled open state of the dialog. Can be binded as `v-model:open`.
   *
   * @default undefined
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  /**
   * The open state of the dialog when it is initially rendered.
   * Use when you do not need to control its open state.
   *
   * @default false
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The modality of the dialog When set to true,
   * interaction with outside elements will be
   * disabled and only dialog content will
   * be visible to screen readers.
   *
   * @default true
   */
  modal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type DialogRootProps = ExtractPublicPropTypes<typeof dialogRootProps>

export interface DialogRootContext {
  open: Readonly<Ref<boolean>>
  modal: Ref<boolean | undefined>
  openModal: () => void
  onOpenChange: (value: boolean) => void
  onOpenToggle: () => void
  triggerElement: Ref<HTMLElement | undefined>
  contentElement: Ref<HTMLElement | undefined>
  contentId: string
  titleId: string
  descriptionId: string
}

export const [injectDialogRootContext, provideDialogRootContext] = createContext<DialogRootContext>('DestylerDialogRoot')

export const dialogRootEmits = {
  /**
   * Event handler called when the open state of the dialog changes.
   */
  'update:open': (_value: boolean) => true,
}

export const DialogRoot = defineComponent({
  name: 'DestylerDialogRoot',
  props: dialogRootProps,
  emits: dialogRootEmits,
  setup(props, { emit }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const triggerElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const { modal } = toRefs(props)

    provideDialogRootContext({
      open,
      modal,
      openModal: () => {
        open.value = true
      },
      onOpenChange: (value) => {
        open.value = value
      },
      onOpenToggle: () => {
        open.value = !open.value
      },
      contentId: '',
      titleId: '',
      descriptionId: '',
      triggerElement,
      contentElement,
    })
  },
  render() {
    return this.$slots.default?.()
  },
})
